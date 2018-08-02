# API ENDPOINTS

## Get Data

* **URL**

  `/api/getdata`

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[String]` - Unique identifier of the queried entity  
   `type=[String]` - Type of the entity (e.g. MBA, MGA or TSO) - used to identify a table name (?)  
   `validFrom=[String]` - Initial date of the queried relationships in a YYYYMMDD format  
   `validTo=[String]` - Final date of the queried relationships in a YYYYMMDD format  
   `view=[String]` - Comma-separated list of entitity types in a relationship with the queried entity, that are supposed to be displayed in the graph  
   

   **Optional:**

*   **Request example:**

    `/api/getdata?id=EIC_10YNO_3________J&type=mba&validityStart=20160101&validityEnd=20180101&view=ro,mga,tso,country`


* **Data Params**

* **Success Response:**

  **Code:** 200 <br />

  **Response structure:**  

    ```javascript
    {
        "config": {
            "groups": {
                /* key, starts from 0 */:
                    {
                        "name":  // name of the group displayed in the legend (e.g. "Market Balance Area) 
                        "color": { // Color settings - optional
                            "background": // Node background
                            "highlight": { 
                                "background": // Node background when selected
                            }
                        }  // DOM coordinates
                        "id": // unique id - required by Visjs
                        "label": // node label to be displayed
                        "group": // group id for node styling
                    },
                    //... other group definitions...//
            },
            "range": {
                "validityStart": // range of queried relationships validity, YYYYMMDD format
                "validityEnd": // range of queried relationships validity, YYYYMMDD format
            }
        },
        "queriedEntity": {
            "id": // globally unique id
            "name": // name of the entity displayed in the info card header
            "type": // name of the entity displayed in the info card subheader, e.g. "Market Balance Area",
            "actions": [
                {
                    "name": // action for an entity, also the label of corresponding button (for example "Edit")
                    "url":  // target url
                },
            ],
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
                    "validityStart": // used for node filtering, YYYY-MM-DDTHH:MM format
                    "validityEnd": // used for node filtering, YYYY-MM-DDTHH:MM format
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
            "legend": {
                "nodes": [
                    {
                        "x": 30,
                        "y": 60,
                        "id": "mba",
                        "label": "mba",
                        "group": "L0",
                    },
                   // ... other nodes ...
                ]
            },
            "range": {
                "validityStart": "01012017",
                "validityEnd": "30122017"
            }
        },
        "queriedEntity": {            
            "id": "EIC_SC_MBA101",
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
            "detail": {
                "id": 11,
                "validityStart": "2015-01-01T00:00",
                "validityEnd": "2021-01-01T00:00",
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
                    "validityStart": "2017-06-30T23:00",
                    "validityEnd": "2017-12-31T23:00",
                    "title": "<h3> EIC_SC_RO09 </h3>\n   <ul>\n    <li>Validity start: 2017-06-30T23:00</li>\n    <li>Validity end: 2017-12-31T23:00</li>\n   </ul>       \n   "
                },
                {
                    "id": "EIC_SC_RO101",
                    "label": "EIC_SC_RO101",
                    "group": 1,
                    "direction": "to",
                    "type": "ro",
                    "validityStart": "2016-12-31T23:00",
                    "validityEnd": "2017-12-31T23:00",
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

## Get Detail

* **URL**

  `/api/getdetail`

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[String]` - Unique identifier of the queried entity  
   `type=[String]` - Type of the entity (e.g. MBA, MGA or TSO) - used to identify a table name (?)
   

   **Optional:**

*   **Request example:**

    `/api/getdetail?id=EIC_SC_MBA101&type=mba`


* **Data Params**


* **Success Response:**

  **Code:** 200 <br />

  **Response structure:** 

    ```javascript
    {
        "queriedEntity": {
            "id": // globally unique id
            "name": // name of the entity displayed in the info card header
            "type": // name of the entity displayed in the info card subheader, e.g. "Market Balance Area",
            "actions": [
                {
                    "type": // Actions for entity, also the label of corresponding button (for example "Edit")
                    "url":  // target url
                },
            ],
            "detail": {
                //...all the attributes that should be displayed in the info card...        
            }
        },
    }

    ```

  **Response example:**  

    ```javascript
    {
        "queriedEntity": {
            
            "id": "EIC_SC_MGA102",
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
            ],
            
            "detail": {
                "id": 3,
                "validityStart": "2015-05-31T23:00",
                "validityEnd": "2020-12-31T23:00",
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

    ```javascript
    {
        "queriedEntity": {
            "error": "entity not found"
        }
    }
    ```

  * **Code:**  <br />
    **Content:** 

* **Sample Call:**


* **Notes:**