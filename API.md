API ENDPOINTS
----
  <_Additional information about your API call. Try to use verbs that match both request type (fetching vs modifying) and plurality (one vs multiple)._>

* **URL**

  `/api/getData`

* **Method:**

  `GET`
  
*  **URL Params**

* **Required:**
 
   `id=[String]` - Unique identifier of the queried entity  
   `type=[String]` - Type of the entity (e.g. MBA, MGA or TSO) - used as a table name (?)  
   `validFrom=[String]` - Initial date of the queried relationships in a DDMMYYYY format  
   `validTo=[String]` - Final date of the queried relationships in a DDMMYYYY format  
   `view=[String]` - Comma-separated list of entitity types in a relationship with the queried entity, that are supposed to be displayed in a graph  
   

*   **Optional:**

*   **Request example:**

    `/api/getData?id=EIC_SC_MBA101&type=mba&validityFrom=01012017&validityTo=30122017&view=ro,mga,tso,country`


* **Data Params**

  <_If making a post request, what should the body payload look like? URL Params rules apply here too._>

* **Success Response:**

  **Code:** 200 <br />

  **Response structure:**  
    ```javascript
    {
        "config": {
            "groupcount": // required - number of groups (one group can for example be all the MBA nodes)
        },
        "queriedentity": {
            "type": // required - displayed in the info card (e.g. Market Balance Area)
            "Name": // required - displayed in the info card
            //... other attributes...        
        },
        "graph": { //connectivity data for visjs
            "nodes": [
                {
                    "id": //required by Visjs - must be unique
                    "label": // displays name of the node in the graph
                    "group": // required - dictates the settings of the group of nodes (e.g. color, highlight color)
                    "title": // displays in a tooltip, can be html markup
                },
                //...other nodes to be displayed...
            ],
            "links": [
                {
                    "from": //id of a node, required by Visjs
                    "to": //id of a node, required by Visjs
                },
                //...other links between nodes...
            ]
        },
        "legend": {
            "nodes": [
                {
                    "x":  // DOM coordinates
                    "y":  // DOM coordinates
                    "id": // unique id - required by Visjs
                    "label": // node label to be displayed
                    "group": // group id for node styling
                    "fixed": true, //visjs settings
                    "physics": false //visjs settings
                },
                //...other nodes displayed as a legend...//
            ]
        }
    }
    ```


  **Content:**  
    ```javascript
    {
        "config": {
            "groupcount": 4
        },
        "queriedentity": {
            "type": "Market balance area",
            "Name": "SC MBA101",
            //... other attributes...        
        },
        "graph": {
            "nodes": [
                {
                    "id": "EIC_SC_RO09",
                    "label": "EIC_SC_RO09",
                    "group": 1,
                    "direction": "to",
                    "validity_start": "2017-06-30T23:00",
                    "validity_end": "2017-12-31T23:00",
                    "title": "<h3> EIC_SC_RO09 </h3>\n   <ul>\n    <li>Validity start: 2017-06-30T23:00</li>\n    <li>Validity end: 2017-12-31T23:00</li>\n   </ul>       \n   "
                },
                //...nodes to be displayed...
                {
                    "id": "SC MBA101",
                    "label": "SC MBA101",
                    "group": 0
                }
            ],
            "links": [
                {
                    "from": "EIC_SC_RO09",
                    "to": "SC MBA101"
                },
                //...links between nodes...
            ]
        },
        "legend": {
            "nodes": [
                {
                    "x": 30,
                    "y": 60,
                    "id": "mba",
                    "label": "mba",
                    "group": "L0",
                    "fixed": true,
                    "physics": false
                },
                //...other nodes displayed as a legend..///
            ]
        }
    }
    ```
 
* **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error : "Email Invalid" }`

* **Sample Call:**


* **Notes:**
