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
            "group_count": // required - number of groups (one group can for example be all the MBA nodes)
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
        "queried_entity": {
           "basic_info": { // all the basic_info attributes are REQUIRED
                "internal_id": // globally unique id
                "name": // name of the entity displayed in the info card header
                "type": // name of the entity displayed in the info card header, e.g. "Market Balance Area",
                "actions": [
                    {
                        "type": // Actions for entity, also the label of corresponding button (for example "Edit")
                        "url":  // target url
                    },
                ]
            },
            "detail": {
                //...all the attributes that should be displayed in the info card...        
            }
        },
        "graph": { // connectivity data for visjs, REQUIRED
            "nodes": [
                {
                   "id": // required by Visjs - must be unique
                    "label": // displays name of the node in the graph
                    "group": // required - dictates the settings of the group of nodes (e.g. color, highlight color)
                    "direction": "to",
                    "type": "ro", // request parameter type, used to create a URL for getDetail endpoint
                    "validity_start": // used for node filtering, YYYY-MM-DDTHH:MM format
                    "validity_end": // used for node filtering, YYYY-MM-DDTHH:MM format
                    "title": // displays in a tooltip, can be html markup
                },
                //...other nodes to be displayed...
            ],
            "links": [
                {
                    "from": // id of a node, required by Visjs
                    "to": // id of a node, required by Visjs
                },
                //...other links between nodes...
            ]
        },
    }
    ```


  **Response example:**  

    ```javascript
    {
        "config": {
            "group_count": 4,
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
                   // ... other nodes ...
                ]
            },
            "range": {
                "validity_from": "01012017",
                "validity_to": "30122017"
            }
        },
        "queried_entity": {
            "basic_info": {
                "internal_id": "EIC_SC_MBA101",
                "name": "SC MBA101",
                "type": "Market Balance Area",
                "actions": [
                    {
                        "type": "Edit",
                        "url": "http://localhost:3000"
                    },
                    {
                        "type": "Delete",
                        "url": "http://localhost:3000"
                    }
                ]
            },
            "detail": {
                "id": 11,
                "Validity_Start": "2015-01-01T00:00",
                "Validity_End": "2021-01-01T00:00",
                "Gate_Closure_TSO-TSO_Trade_Hour": "12.00",
                "Gate_Closure_Supportive_Power_Hour": "12.00",
                // ... other attributes ...
            }
        },
        "graph": {
            "nodes": [
                {
                    "id": "EIC_SC_RO09",
                    "label": "EIC_SC_RO09",
                    "group": 1,
                    "direction": "to",
                    "type": "ro",
                    "validity_start": "2017-06-30T23:00",
                    "validity_end": "2017-12-31T23:00",
                    "title": "<h3> EIC_SC_RO09 </h3>\n   <ul>\n    <li>Validity start: 2017-06-30T23:00</li>\n    <li>Validity end: 2017-12-31T23:00</li>\n   </ul>       \n   "
                },
                {
                    "id": "EIC_SC_RO101",
                    "label": "EIC_SC_RO101",
                    "group": 1,
                    "direction": "to",
                    "type": "ro",
                    "validity_start": "2016-12-31T23:00",
                    "validity_end": "2017-12-31T23:00",
                    "title": "<h3> EIC_SC_RO101 </h3>\n   <ul>\n    <li>Validity start: 2016-12-31T23:00</li>\n    <li>Validity end: 2017-12-31T23:00</li>\n   </ul>       \n   "
                },
                // ... other nodes ...

                { // ... queried node get a group of 0...
                    "id": "EIC_SC_MBA101",
                    "label": "SC MBA101",
                    "type": "mba",
                    "group": 0
                }
            ],
            "links": [
                {
                    "from": "EIC_SC_RO09",
                    "to": "EIC_SC_MBA101"
                },
                // ... other links ...
            ]
        }
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
    "queried_entity": {
        "basic_info": { // all the basic_info attributes are REQUIRED
            "internal_id": // globally unique id
            "name": // name of the entity displayed in the info card header
            "type": // name of the entity displayed in the info card header, e.g. "Market Balance Area",
            "actions": [
                {
                    "type": // Actions for entity, also the label of corresponding button (for example "Edit")
                    "url":  // target url
                },
            ]
        },
        "detail": {
            //...all the attributes that should be displayed in the info card...        
        }
    },
    ```

  **Response example:**  

    ```javascript
    {
        "queried_entity": {
            "basic_info": {
                "internal_id": "EIC_SC_MGA102",
                "name": "SC MGA102",
                "type": "Metering Grid Area",
                "actions": [
                    {
                        "type": "Edit",
                        "url": "http://localhost:3000"
                    },
                    {
                        "type": "Delete",
                        "url": "http://localhost:3000"
                    }
                ]
            },
            "detail": {
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
    }
    ```
 
* **Error Response:**

  * **Code:**  <br />
    **Content:** 

  * **Code:**  <br />
    **Content:** 

* **Sample Call:**


* **Notes:**