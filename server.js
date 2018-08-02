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
    //console.log(viewDictionary[req.query.type].rels[view[i]])
    const table = viewDictionary[req.query.type].rels[view[i]].table;
    const joinTable = viewDictionary[view[i]].table;
    const joinIdentifier = viewDictionary[view[i]].identifier;
    const identifier = viewDictionary[req.query.type].rels[view[i]].identifier;
    const direction = viewDictionary[req.query.type].rels[view[i]].direction;
    const where = viewDictionary[req.query.type].rels[view[i]].where;
    const type = view[i];
    queryString +=
      `select x.${identifier} as id, y.name as label, ${i + 1} as "group",
      "${direction}" as direction, "${type}" as "type", x.validity_start, x.validity_end
      from ${table} x left join ${joinTable} y on x.${identifier} = y.${joinIdentifier} where x.${where} like ?
      union `;
    queryParams.push(req.query.id);
  }
  console.log(queryString)
  let lastIndex = queryString.trim().lastIndexOf(" ");
  queryString = queryString.substring(0, lastIndex);
  const groups = createGroups(view, req.query.type);
  let configGraph = {
    "groups":groups,
    "range": {
      "validityFrom": req.query.validityFrom,
      "validityTo": req.query.validityTo
    }
  };

  db.query(queryString, queryParams, function (err, rows, fields) {
    if (err) throw err;
    rows.map(node => {
      node.title = createNodeTooltipHtml(node);
    })
    db.query(`select * from ${viewDictionary[req.query.type].table} where internal_id = ?`, [req.query.id], function (err2, rows2, fields2) {
      if (err2) throw err2;
      if (!rows2.length > 0) {
        res.json({});
      } else {
        const detail = rows2[0];
        detail.title = createNodeTooltipHtml(detail);
        const links = computeLinks(rows, detail);
        rows.push({ "id": detail.Internal_ID, "label": detail.Name, "type": req.query.type, "group": 0, "title": detail.title })
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
            "links": links
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
      let config = {}
      config.internal_id = req.query.id;
      config.name = detail.Name;
      config.typeFull = viewDictionary[req.query.type].name;
      config.type = viewDictionary[req.query.type].table;
      config.actions = createNodeActions(detail);
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

function computeLinks(rows, queriedEntity) {
  var links = [];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].direction.localeCompare("from")) {
      links.push({ "from": rows[i].id, "to": queriedEntity.Internal_ID,"hiddenLabel": rows[i].validity_start + " -- " + rows[i].validity_end})
    } else if (rows[i].direction.localeCompare("to")) {
      links.push({ "from": queriedEntity.Internal_ID, "to": rows[i].id,"hiddenLabel": rows[i].validity_start  + " -- " + rows[i].validity_end})
    }
  }
  return links;
}

function createGroups(view, type) {
  let groups = {};
  let i = 0;
  let group = {
    [i]: {
      "name": viewDictionary[type].name,
      "color": {
        "background": viewDictionary[type].color,
        "highlight": {
          "background": '#ffbcbc',
        }
      }
    }
  }
  Object.assign(groups,group);
  i++;
  view.forEach(v => {
    let group = {
      [i]: {
        "name": viewDictionary[v].name,
        "color": {
          "background": viewDictionary[v].color,
          "highlight": {
            "background": '#ffbcbc',
          }
        }
      }
    }
    Object.assign(groups,group);
    i++;
  });
  return groups;
}


function createNodeTooltipHtml(node) {
  return (`<h3> ${node.id} </h3>
      <ul class="tooltip-list">
          <li>Validity start: ${node.validity_start}</li>
          <li>Validity end: ${node.validity_end}</li>
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

/*
app.get('/api/regulationobjects/:id/relationships', (req, res) => {
  db.query('select production_unit as id, production_unit as label, 2 as "group", "to" as direction, validity_start, validity_end from pu_ro_rel where regulation_object like ? union ' +
    'select balance_responsible_party as id, balance_responsible_party as label, 3 as "group", "from" as direction, validity_start, validity_end from ro_brp_rel where regulation_object like ? union ' +
    'select mba as id, mba as label, 4 as "group", "from" as direction, validity_start, validity_end from ro_location where regulation_object like ?', [req.params.id, req.params.id, req.params.id], function (err, rows, fields) {
      if (err) throw err;
      db.query('select * , "Regulation object" as type from ro where internal_id = ?', [req.params.id], function (err2, rows2, fields2) {
        if (err2) throw err2;
        const queriedEntity = rows2[0];
        const links = computeLinks(rows, queriedEntity);
        rows.push({ "id": queriedEntity.Name, "label": queriedEntity.Name, "group": 1 })
        res.json({
          'queriedentity': queriedEntity,
          'nodes': rows,
          'links': links
        });
      });
    })
});

app.get('/api/countries/:id/relationships', (req, res) => {
  db.query('select Balance_Responsible_Party as id, Balance_Responsible_Party as label, 2 as "group", "to" as direction, validity_start, validity_end from country_brp_rel where country like ? ' +
    'union select retailer as id, retailer as label, 3 as "group", "to" as direction, validity_start, validity_end from re_branch where country like ? ' +
    'union select Name as id, Name as label, 4 as "group", "to" as direction, validity_start, validity_end from mba where country like ? ' +
    'union select Distribution_System_Operator as id,Distribution_System_Operator as label, 5 as "group", "to" as direction, validity_start, validity_end from dso_branch where country like ?', [req.params.id, req.params.id, req.params.id, req.params.id], function (err, rows, fields) {
      if (err) throw err;
      db.query('select * , "Country" as type from country where ISO_CODE = ?', [req.params.id], function (err2, rows2, fields2) {
        if (err2) throw err2;
        const queriedEntity = rows2[0];
        const links = computeLinks(rows, queriedEntity);
        rows.push({ "id": queriedEntity.Name, "label": queriedEntity.Name, "group": 1 })
        res.json({
          'queriedentity': queriedEntity,
          'nodes': rows,
          'links': links
        });
      });
    })
});

app.get('/api/productionunits/:id/relationships', (req, res) => {
  db.query('select Regulation_Object as id, Regulation_object as label, 2 as "group", "from" as direction, validity_start, validity_end from pu_ro_rel where production_unit like ? ' +
    'union select Retailer as id, Retailer as label, 3 as "group", "from" as direction, validity_start, validity_end from pu_re_rel where production_unit like ? ' +
    'union select mga as id, mga as label, 4 as "group", "from" as direction, validity_start, validity_end from pu_mga_rel where production_unit like ?', [req.params.id, req.params.id, req.params.id, req.params.id], function (err, rows, fields) {
      if (err) throw err;
      db.query('select * , "Production unit" as type from pu where internal_id = ?', [req.params.id], function (err2, rows2, fields2) {
        if (err2) throw err2;
        const queriedEntity = rows2[0];
        const links = computeLinks(rows, queriedEntity);
        rows.push({ "id": queriedEntity.internal_id, "label": queriedEntity.Name, "group": 1 })
        res.json({
          'queriedentity': queriedEntity,
          'nodes': rows,
          'links': links
        });
      });
    })
});

app.get('/api/marketbalanceareas/:id/relationships', (req, res) => {
  db.query('select Regulation_Object as id, Regulation_object as label, 2 as "group", "to" as direction, validity_start, validity_end from ro_location where MBA like ? ' +
    'union select MGA as id, MGA as label, 3 as "group", "to" as direction, validity_start, validity_end from mba_mga_rel where MBA like ? ' +
    'union select TSO as id,TSO as label, 4 as "group", "from" as direction, validity_start, validity_end from mba where internal_id like ?', [req.params.id, req.params.id, req.params.id, req.params.id], function (err, rows, fields) {
      if (err) throw err;
      db.query('select *, "Market balance area" as type from mba where internal_id = ?', [req.params.id], function (err2, rows2, fields2) {
        if (err2) throw err2;
        const queriedEntity = rows2[0];
        const links = computeLinks(rows, queriedEntity);
        rows.push({ "id": queriedEntity.Name, "label": queriedEntity.Name, "group": 1 })
        res.json({
          'queriedentity': queriedEntity,
          'nodes': rows,
          'links': links
        });
      });
    })
});

app.get('/api/retailers/:id/relationships', (req, res) => {
  db.query('select company as id, company as label, 2 as "group", "from" as direction, validity_start, validity_end from re where internal_id like ? ' +
    'union select MGA as id, mga as label, 3 as "group", "from" as direction, validity_start, validity_end from mga_re_rel where retailer like ? ' +
    'union select country as id, country as label, 4 as "group", "from" as direction, validity_start, validity_end from re_branch where retailer like ?', [req.params.id, req.params.id, req.params.id, req.params.id], function (err, rows, fields) {
      if (err) throw err;
      db.query('select * , "Retailer" as type from re  where internal_id = ?', [req.params.id], function (err2, rows2, fields2) {
        if (err2) throw err2;
        const queriedEntity = rows2[0];
        const links = computeLinks(rows, queriedEntity);
        rows.push({ "id": queriedEntity.Name, "label": queriedEntity.Name, "group": 1 })
        res.json({
          'queriedentity': queriedEntity,
          'nodes': rows,
          'links': links
        });
      });
    })
});
*/
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);