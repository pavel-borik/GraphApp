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
    }
    ```


  **Content:**  

    ```javascript
    {
        "config": {
            "groupcount": 4,
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
    }
    ```
 
* **Error Response:**


  * **Code:**  <br />
    **Content:** 


* **Sample Call:**

* **Notes:**
____
* **URL**

  `/api/getDetail`

* **Method:**

  `GET`
  
*  **URL Params**

* **Required:**
 
   `id=[String]` - Unique identifier of the queried entity  
   `type=[String]` - Type of the entity (e.g. MBA, MGA or TSO) - used as a table name (?)
   

*   **Optional:**

*   **Request example:**

    `/api/getDetail?id=EIC_SC_MBA101&type=mba`


* **Data Params**


* **Success Response:**

  **Code:** 200 <br />

  **Response structure:** 

    ```javascript
    {
        "queriedentity": {
            "Name": //required - displayed in the info card heading
            "type": //required - displayed in the info card sub-heading
            //... other attributes that should be displayed in the info card...
            }
    }
    ```

  **Content:**  

    ```javascript
    {
        "queriedentity": {
            "id": 3,
            "Validity_Start": "2015-05-31T23:00",
            "Validity_End": "2020-12-31T23:00",
            "Coding_Scheme": "EIC",
            "MGA_Type": "DISTRIBUTION",
            "Short_name": null,
            "Name": "SC MGA102",
            "Code": "SC_MGA102",
            "Internal_ID": "EIC_SC_MGA102"
            }
    }
    ```
 
* **Error Response:**

  * **Code:**  <br />
    **Content:** 

  * **Code:**  <br />
    **Content:** 

* **Sample Call:**


* **Notes:**