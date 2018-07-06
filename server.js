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
    "rels": {
      "ro": {
        table: "ro_location",
        identifier: "regulation_object",
        direction: "to",
        where: "mba",
        timedependent:true,
      },
      "mga": {
        table: "mba_mga_rel",
        identifier: "mga",
        direction: "to",
        where: "mba",
        timedependent:true,
      },
      "tso": {
        table: "mba",
        identifier: "tso",
        direction: "from",
        where: "internal_id",
        timedependent:false,
      },
      "country": {
        table: "mba",
        identifier: "country",
        direction: "from",
        where: "internal_id",
        timedependent:false,
      },
    }
  }
}
app.get('/api/getdata', (req, res) => {
  //console.log(req.query);
  const view = req.query.view.split(',')
  let queryString = '';
  let queryParams = [];
  for (let i = 0; i < view.length; i++) {
    //console.log(viewDictionary[req.query.type].rels[view[i]])
    const table = viewDictionary[req.query.type].rels[view[i]].table;
    const identifier = viewDictionary[req.query.type].rels[view[i]].identifier;
    const direction = viewDictionary[req.query.type].rels[view[i]].direction;
    const where = viewDictionary[req.query.type].rels[view[i]].where;
    const type = req.query.type;
    queryString += `select ${identifier} as id, ${identifier} as label, ${i + 1} as "group", "${direction}" as direction, validity_start, validity_end from ${table} where ${where} like ? union `;
    queryParams.push(req.query.id);
  }

  let lastIndex = queryString.trim().lastIndexOf(" ");
  queryString = queryString.substring(0, lastIndex);

  let config = {
    "groupcount": view.length 
  };

  db.query(queryString, queryParams, function (err, rows, fields) {
    if (err) throw err;
    rows.map(node => {
      node.title = createTooltipHtml(node);
    })
    db.query('select *, "Market balance area" as type from mba where internal_id = ?', [req.query.id], function (err2, rows2, fields2) {
      if (err2) throw err2;
      const queriedEntity = rows2[0];
      const links = computeLinks(rows, queriedEntity);
      rows.push({ "id": queriedEntity.Name, "label": queriedEntity.Name, "group": 0 })
      res.json({
        "config": config,
        "queriedentity": queriedEntity,
        "nodes": rows,
        "links": links
      });
    });
  })
});

function createTooltipHtml(node) {
   return `<h3> ${node.id} </h3>
   <ul>
    <li>Validity start: ${node.validity_start}</li>
    <li>Validity end: ${node.validity_end}</li>
   </ul>       
   `;
}

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
        rows.push({ "id": queriedEntity.Name, "label": queriedEntity.Name, "group": 1 })
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

function computeLinks(rows, queriedEntity) {
  var links = [];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].direction.localeCompare("from")) {
      links.push({ "from": rows[i].id, "to": queriedEntity.Name })
    } else if (rows[i].direction.localeCompare("to")) {
      links.push({ "from": queriedEntity.Name, "to": rows[i].id })
    }
  }
  return links;
}

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);