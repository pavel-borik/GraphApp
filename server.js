const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
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
    "identifier": "Internal_ID",
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
    "identifier": "Internal_ID",
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
    "identifier": "Internal_ID",
    "color": "#ffe119",
  },
  "tso": {
    "name": "Transmission System Operator",
    "table": "tso",
    "identifier": "Internal_ID",
    "color": "#0082c8",
  },
  "country": {
    "name": "Country",
    "table": "country",
    "identifier": "ISO_CODE",
    "color": "#f58231",

  },
  "prod_type": {
    "name": "Production type",
    "table": "prod_type",
    "identifier": "Internal_ID",
    "color": "#911eb4",
  },
  "brp": {
    "name": "Balance Responsible Party",
    "table": "brp",
    "identifier": "Internal_ID",
    "color": "#46f0f0",
  },
  "re": {
    "name": "Retailer",
    "table": "re",
    "identifier": "Internal_ID",
    "color": "#48ccbb",
  },
  "dso": {
    "name": "Distribution System Operator",
    "table": "dso",
    "identifier": "Internal_ID",
    "color": "#90770f",
  },
  "party": {
    "name": "Company",
    "table": "party",
    "identifier": "WS_ID",
    "color": "#ac90e3",
    "rels": {
      "tso": {
        table: "tso",
        identifier: "internal_id",
        direction: "to",
        where: "company",
        timedependent: false,
      },
      "dso": {
        table: "dso",
        identifier: "internal_id",
        direction: "to",
        where: "company",
        timedependent: false,
      },
      "country": {
        table: "company_branch",
        identifier: "country",
        direction: "from",
        where: "party",
        timedependent: true,
      },
      "brp": {
        table: "brp",
        identifier: "internal_id",
        direction: "to",
        where: "company",
        timedependent: false,
      },
    },
  },
  "pu": {
    "name": "Production Unit",
    "table": "pu",
    "identifier": "internal_id",
    "color": "#f032e6",
    "rels": {
      "mga": {
        table: "pu_mga_rel",
        identifier: "mga",
        direction: "from",
        where: "production_unit",
        timedependent: false,
      },
      "re": {
        table: "pu_re_rel",
        identifier: "retailer",
        direction: "from",
        where: "production_unit",
        timedependent: true,
      },
      "ro": {
        table: "pu_ro_rel",
        identifier: "Regulation_Object",
        direction: "from",
        where: "production_unit",
        timedependent: true,
      },
    },
  },
}

app.get('/api/getdata', (req, res) => {
  //console.log(req.query);
  const view = req.query.view.split(',')
  let queryString = '';
  let queryParams = [];
  const validityStart = req.query.validityStart;
  const validityEnd = req.query.validityEnd;

  for (let i = 0; i < view.length; i++) {
    const table = viewDictionary[req.query.type].rels[view[i]].table;
    const joinTable = viewDictionary[view[i]].table;
    const joinIdentifier = viewDictionary[view[i]].identifier;
    const identifier = viewDictionary[req.query.type].rels[view[i]].identifier;
    const direction = viewDictionary[req.query.type].rels[view[i]].direction;
    const where = viewDictionary[req.query.type].rels[view[i]].where;
    const type = view[i];
    queryString +=
      `select UUID() as id, x.${identifier} as internalId, y.name as name, "${("g" + (i + 1))}" as "group",
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
      "validityStart": validityStart,
      "validityEnd": validityEnd
    }
  };

  db.query(queryString, queryParams, function (err, rows, fields) {
    if (err) throw err;
    rows.map(node => {
      node.title = createNodeTooltipHtml(node);
      node.typeFullName = viewDictionary[node.type].name;
    });

    /**
     * Calculating subclustering
     */
    /*
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
                "name": "Subcluster " + currentSubcluster.toString(),
              }
              clusteringDescription.push(desc);
            }
          }
        });
      }
      groups[key].clustering = clusteringDescription;
    }
    */

    db.query(`select *, UUID() as uuid from ${viewDictionary[req.query.type].table} where ${viewDictionary[req.query.type].identifier} = ?`, [req.query.id], function (err2, rows2, fields2) {
      if (err2) throw err2;
      if (!rows2.length > 0) {
        res.json({});
      } else {
        const queriedEntity = rows2[0];
        //console.log(queriedEntity)
        const keys = Object.keys(rows2[0]);
        const values = Object.values(rows2[0]);
        let detail = "<ul>";
        for (let i = 0; i < keys.length; i++) {
          detail += `<li> ${keys[i]}: ${values[i]} </li>`
        }
        detail += "</ul>"

        queriedEntity.title = (`<h3> ${queriedEntity.Internal_ID} </h3>
        <ul class="tooltip-list">
            <li>Validity start: ${queriedEntity.Validity_Start}</li>
            <li>Validity end: ${queriedEntity.Validity_End}</li>
        </ul>      
        `)
        //console.log(detail)
        const edges = computeEdges(rows, queriedEntity, validityStart, validityEnd);
        rows.map(r => delete r.direction)
        rows.push({
          "id": queriedEntity.uuid, "internalId": queriedEntity[viewDictionary[req.query.type].identifier], "name": queriedEntity.Name,
          "type": req.query.type, "typeFullName": viewDictionary[req.query.type].name, "group": "g0", "title": queriedEntity.title, "validityStart": queriedEntity.Validity_Start, "validityEnd": queriedEntity.Validity_End
        })
        let obj = {};let objs = [];
        rows.map(node => {
          obj.data = node;
          objs.push(obj);
          obj = {};
        });

        const id = req.query.id;
        const name = queriedEntity.Name;
        const typeFullName = viewDictionary[req.query.type].name;
        const type = viewDictionary[req.query.type].table;
        const actions = createNodeActions(queriedEntity);

        res.json({
          "config": configGraph,
          "queriedEntity": {
            //"id": id,
            "name": name,
            //"type": type,
            "typeFullName": typeFullName,
            "actions": actions,
            "detail": detail,
          },
          "graph": {
            "nodes": objs,
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
      const keys = Object.keys(rows[0]);
      const values = Object.values(rows[0]);
      let detail = "<ul>";
      for (let i = 0; i < keys.length; i++) {
        detail += `<li> ${keys[i]}: ${values[i]} </li>`
      }
      detail += "<li> test: <a href='http://localhost:3000/getdata?id=EIC_10YNO_3________J&type=mba&validityStart=20150101&validityEnd=20180101&view=ro,mga,tso,country'>test</a></li>"
      detail += "</ul>"
      res.json({
        "queriedEntity": {
            /*
            "id": id,
            "name": name,
            "type": type,
            "typeFullName": typeFullName,
            */
          "actions": createNodeActions(rows[0]),
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

function computeEdges(rows, queriedEntity, validityStart, validityEnd) {
  var edges = [];
  validityStartMoment = moment(validityStart);
  validityEndMoment = moment(validityEnd);
  for (var i = 0; i < rows.length; i++) {
    let classes = "autorotate"
    if (rows[i].direction.localeCompare("from")) {
      const resultEdge = {data:  { "source": rows[i].id, "target": queriedEntity.uuid, "label": "", "hiddenLabel": rows[i].validityStart + " -- " + rows[i].validityEnd, } }
      if (moment(rows[i].validityStart).isAfter(validityStart) || moment(rows[i].validityEnd).isBefore(validityEnd)) classes += " changesValidity";
      resultEdge.classes = classes;
      edges.push(resultEdge);
    } else if (rows[i].direction.localeCompare("to")) {
      const resultEdge = { data: { "source": queriedEntity.uuid, "target": rows[i].id, "label": "", "hiddenLabel": rows[i].validityStart + " -- " + rows[i].validityEnd, } }
      if (moment(rows[i].validityStart).isAfter(validityStart) || moment(rows[i].validityEnd).isBefore(validityEnd)) classes += " changesValidity";
      resultEdge.classes = classes;
      edges.push(resultEdge);

    }
  }
  return edges;
}

function createGroups(view, type) {
  let groups = {};
  let i = 0;
  let key = "g" + i;
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
    let key = "g" + i;
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
  return `<h3> ${node.id} </h3><ul class="tooltip-list"><li>Validity start: ${node.validityStart}</li><li>Validity end: ${node.validityEnd}</li></ul>`;
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