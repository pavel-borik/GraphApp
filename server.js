const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'esett'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Mysql connected')
});

let viewDictionary = {
  "mba": {
    "name": "Market Balance Area",
    "table": "mba",
    "identifier": "internal_id",
    "color": "#e6194b",
    "rels": {
      "ro": {
        table: "ro_location",
        identifier: "regulation_object",
        direction: "to",
        where: "mba",
        timedependent: true,
      },
      "mga": {
        table: "mba_mga_rel",
        identifier: "mga",
        direction: "to",
        where: "mba",
        timedependent: true,
      },
      "tso": {
        table: "mba",
        identifier: "tso",
        direction: "from",
        where: "internal_id",
        timedependent: false,
      },
      "country": {
        table: "mba",
        identifier: "country",
        direction: "from",
        where: "internal_id",
        timedependent: false,
      },
    }
  },
  "ro": {
    "name": "Regulation Object",
    "table": "ro",
    "identifier": "internal_id",
    "color": "#3cb44b",
    "rels": {
      "prod_type": {
        table: "ro",
        identifier: "production_type",
        direction: "from",
        where: "internal_id",
        timedependent: false,
      },
      "brp": {
        table: "ro_brp_rel",
        identifier: "Balance_Responsible_Party",
        direction: "from",
        where: "regulation_object",
        timedependent: true,
      },
      "pu": {
        table: "pu_ro_rel",
        identifier: "production_unit",
        direction: "from",
        where: "regulation_object",
        timedependent: true,
      },
      "mba": {
        table: "ro_location",
        identifier: "mba",
        direction: "from",
        where: "regulation_object",
        timedependent: true,
      },
    },
  },
  "mga": {
    "name": "Metering Grid Area",
    "table": "mga",
    "identifier": "internal_id",
    "color": "#ffe119",
  },
  "tso": {
    "name": "Transmission System Operator",
    "table": "tso",
    "identifier": "internal_id",
    "color": "#0082c8",
  },
  "country": {
    "name": "Country",
    "table": "country",
    "identifier": "iso_code",
    "color": "#f58231",

  },
  "prod_type": {
    "name": "Production type",
    "table": "prod_type",
    "identifier": "internal_id",
    "color": "#911eb4",
  },
  "brp": {
    "name": "Balance Responsible Party",
    "table": "brp",
    "identifier": "internal_id",
    "color": "#46f0f0",
  },
  "pu": {
    "name": "Production Unit",
    "table": "pu",
    "identifier": "internal_id",
    "color": "#f032e6",
  },
}

app.get('/api/getdata', (req, res) => {
  //console.log(req.query);
  const view = req.query.view.split(',')
  let queryString = '';
  let queryParams = [];
  for (let i = 0; i < view.length; i++) {
    const table = viewDictionary[req.query.type].rels[view[i]].table;
    const joinTable = viewDictionary[view[i]].table;
    const joinIdentifier = viewDictionary[view[i]].identifier;
    const identifier = viewDictionary[req.query.type].rels[view[i]].identifier;
    const direction = viewDictionary[req.query.type].rels[view[i]].direction;
    const where = viewDictionary[req.query.type].rels[view[i]].where;
    const type = view[i];
    queryString +=
      `select UUID() as id, x.${identifier} as internalId, y.name as label, "${("g"+ (i + 1))}" as "group",
      "${direction}" as direction, "${type}" as "type", x.validity_start as validityStart, x.validity_end as validityEnd
      from ${table} x left join ${joinTable} y on x.${identifier} = y.${joinIdentifier} where x.${where} like ?
      union `;
    queryParams.push(req.query.id);
  }
  console.log(queryString)
  let lastIndex = queryString.trim().lastIndexOf(" ");
  queryString = queryString.substring(0, lastIndex);
  const groups = createGroups(view, req.query.type);
  let configGraph = {
    "groups": groups,
    "range": {
      "validityStart": req.query.validityStart,
      "validityEnd": req.query.validityEnd
    }
  };

  db.query(queryString, queryParams, function (err, rows, fields) {
    if (err) throw err;
    rows.map(node => {
      node.title = createNodeTooltipHtml(node);
    });

    /**
     * Calculating subclustering
     */
    let countPerGroup = new Map();
    for (let i = 0; i < Object.keys(groups).length; i++) {
      countPerGroup.set(Object.keys(groups)[i], 0);
    }
    rows.forEach(r => {
      countPerGroup.set(r.group, countPerGroup.get(r.group) + 1)
    })

    for (let [key, value] of countPerGroup.entries()) {
      let clusteringDescription = [];
      if (value > 50) {
        const nOfSubclusters = Math.ceil(value / 50);
        const maxPerCluster = Math.round(value / nOfSubclusters);

        let count = 1;
        let currentSubcluster = 1
        desc = {
          "id": currentSubcluster,
          "name": "Subcluster " + currentSubcluster.toString(),
        }
        clusteringDescription.push(desc);
        rows.forEach(r => {
          if (r.group == key) {
            if (count < maxPerCluster) {
              r.subcluster = currentSubcluster;
              count++;
            } else if (count === maxPerCluster) {
              r.subcluster = currentSubcluster;
              count = 0;
              currentSubcluster++;
              desc = {
                "id": currentSubcluster,
                "name":  "Subcluster " + currentSubcluster.toString(),
              }
              clusteringDescription.push(desc);
            }
          }
        });
      }
      groups[key].clustering = clusteringDescription;
    }


    db.query(`select *, UUID() as uuid from ${viewDictionary[req.query.type].table} where internal_id = ?`, [req.query.id], function (err2, rows2, fields2) {
      if (err2) throw err2;
      if (!rows2.length > 0) {
        res.json({});
      } else {
        const detail = rows2[0];
        detail.title = (`<h3> ${detail.Internal_ID} </h3>
        <ul class="tooltip-list">
            <li>Validity start: ${detail.Validity_Start}</li>
            <li>Validity end: ${detail.Validity_End}</li>
        </ul>      
        `)
        //console.log(detail)
        const edges = computeEdges(rows, detail);
        rows.push({ "id": detail.uuid, "internalId": detail.Internal_ID, "label": detail.Name, 
        "type": req.query.type, "group": "g0", "title": detail.title, "validityStart": detail.Validity_Start, "validityEnd": detail.Validity_End })
        const id = req.query.id;
        const name = detail.Name;
        const typeFull = viewDictionary[req.query.type].name;
        const type = viewDictionary[req.query.type].table;
        const actions = createNodeActions(detail);
        res.json({
          "config": configGraph,
          "queriedEntity": {
            "id": id,
            "name": name,
            "type": type,
            "typeFull": typeFull,
            "actions": actions,
            "detail": detail,
          },
          "graph": {
            "nodes": rows,
            "edges": edges
          },
        });
      }
    });
  })
});

app.get('/api/getdetail', (req, res) => {
  //console.log(req.query);
  const queriedTable = viewDictionary[req.query.type].table;
  const identifier = viewDictionary[req.query.type].identifier;
  db.query(`select * from ${queriedTable} where ${identifier} = ? limit 1`, req.query.id, function (err, rows, fields) {
    if (err) throw err;
    if (rows.length > 0) {
      const detail = rows[0];
      res.json({
        "queriedEntity": {
          "id": req.query.id,
          "name": detail.Name,
          "type": viewDictionary[req.query.type].table,
          "typeFull": viewDictionary[req.query.type].name,
          "actions": createNodeActions(detail),
          "detail": detail,
        },
      });
    } else {
      res.json({
        "queriedEntity": {
          "error": "entity not found"
        }
      });
    }
  })
});

function computeEdges(rows, queriedEntity) {
  var edges = [];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].direction.localeCompare("from")) {
      edges.push({ "from": rows[i].id, "to": queriedEntity.uuid, "hiddenLabel": rows[i].validityStart + " -- " + rows[i].validityEnd })
    } else if (rows[i].direction.localeCompare("to")) {
      edges.push({ "from": queriedEntity.uuid, "to": rows[i].id, "hiddenLabel": rows[i].validityStart + " -- " + rows[i].validityEnd })
    }
  }
  return edges;
}

function createGroups(view, type) {
  let groups = {};
  let i = 0;
  let key = "g"+i;
  let group = {
    [key]: {
      "name": viewDictionary[type].name,
      "color": {
        "background": viewDictionary[type].color,
        "highlight": {
          "background": '#ffbcbc',
        }
      }
    }
  }
  Object.assign(groups, group);
  i++;
  view.forEach(v => {
    let key = "g"+i;
    let group = {
      [key]: {
        "name": viewDictionary[v].name,
        "color": {
          "background": viewDictionary[v].color,
          "highlight": {
            "background": '#ffbcbc',
          }
        }
      }
    }
    Object.assign(groups, group);
    i++;
  });
  return groups;
}


function createNodeTooltipHtml(node) {
  return (`<h3> ${node.id} </h3>
      <ul class="tooltip-list">
          <li>Validity start: ${node.validityStart}</li>
          <li>Validity end: ${node.validityEnd}</li>
      </ul>      
   `);
}

function createNodeActions(node) {
  let actions = [
    {
      "name": "Edit",
      "url": "http://localhost:3000"
    },
    {
      "name": "Delete",
      "url": "http://localhost:3000"
    }
  ];
  return actions;
}

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);