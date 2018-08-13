# API ENDPOINTS

## Get Data

* **URL**

  `/api/getdata`

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[String]` - Identifier of the queried entity - used for the database query  
   `type=[String]` - Abbreviated type of the entity (e.g. mba, mga or tso) - used to identify the database table name  
   `validityStart=[String]` - Initial date of the queried relationships in a YYYYMMDD format  
   `validityEnd=[String]` - Final date of the queried relationships in a YYYYMMDD format  
   `view=[String]` - Identifier of the view to display  
   

   **Optional:**

*   **Request example:**

    `/api/getdata?id=EIC_10YNO_3________J&type=mba&validityStart=20150101&validityEnd=20180101&view=ro,mga,tso,country`

*   **URL usage example:**

    `http://localhost:3000/getdata?id=EIC_10YNO_3________J&type=mba&validityStart=20150101&validityEnd=20180101&view=ro,mga,tso,country`

* **Data Params**

* **Success Response:**

  **Code:** 200 <br />

  **Response structure:**  

    ```javascript
    {
    "config": {
        "groups": { // definition of node groups
            "g2": { // group key
                "name": "Metering Grid Area", // group name, displayed in the legend
                "color": { // group color styling - optional
                    "background": "#ffe119", // node background color
                    "highlight": { 
                        "background": "#ffbcbc" // node background color when clicked on
                    }
                },
                "clustering": [ // definition of sublusters
                    {
                        "id": 1, // subcluster id, should be unique in this array, used in vis.js clustering function
                        "name": "Subcluster 1" // label of the cluster displayed on the cluster node
                    }
                ]
            },
            // ...other group definitions...
        },
        "range": { // validity dates, used by datepickers, YYYYMMDD format
            "validityStart": "20150101",
            "validityEnd": "20180101"
        }
    },
    "queriedEntity": { // entity information displayed in the info card - for optimization
        "name": "NO3", // entity name displayed in the info card header
        "typeFullName": "Market Balance Area", // entity type name displayed in the info card header
        "actions": [ // corresponding buttons are created from this array
            {
                "name": "Edit", // name label on the button
                "url": "http://localhost:3000" // target url
            },
            // ...other action definitions...
        ],
        "detail": // string composed of HTML markup, displayed in the info card
    },
    "graph": { // connectivity information
        "nodes": [
            {
                "id": "ac3f6ea5-9bbf-11e8-a86c-1c6f65c3aae2", // UUID - required by Vis.js
                "internalId": "EIC_SC_RO106", // identifier used for composing getDetail query URL (should be able to query this id in the database)
                "label": "SC RO106", // name of the entity - label in the vizualization, also displayed in the info card header
                "group": "g1", // reference of the group key in the config part - used for styling and clustering
                "type": "ro", // type identifier used for composing getDetail query URL (this should determine the target database table)
                "title": "<h3> ac3f6ea5-9bbf-11e8-a86c-1c6f65c3aae2 </h3><ul class=\"tooltip-list\"><li>Validity start: 2017-05-01T00:00</li><li>Validity end: 2018-09-01T00:00</li></ul>", // tooltip content (displayed after hovering over the node), in HTML markup
                "typeFullName": "Regulation Object" // displayed in the info card header
            },
            // ...other nodes definitions...
        ],
        "edges": [
            {
                "from": "ac3f6ea5-9bbf-11e8-a86c-1c6f65c3aae2", // id of the node
                "to": "ac415666-9bbf-11e8-a86c-1c6f65c3aae2", // id of the node
                "validityStart": "2017-05-01T00:00", // starting date of the relationship validity, YYYY-MM-DDTHH:MM format, used for the filtering
                "validityEnd": "2018-09-01T00:00", // end date of the relationship validity, YYYY-MM-DDTHH:MM format, used for the filtering
                "hiddenLabel": "2017-05-01T00:00 -- 2018-09-01T00:00", // used for displaying edge label after clicking on it
                "validityChanges": true // true if validity of this relationship STARTS AFTER the queried validity start date or ENDS BEFORE the end of the validity end date
            },
            // ...other edges definitions...
        ]
    }
    }
    ```


  **Response example:**  

 
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
 
   `id=[String]` - Identifier of the queried entity - used for the database query  
   `type=[String]` - Abbreviated type of the entity (e.g. mba, mga or tso) - used to identify the database table name
   

   **Optional:**

*   **Request example:**

    `/api/getdetail?id=EIC_10X1001A1001A38Y&type=tso`

* **Data Params**

* **Success Response:**

  **Code:** 200 <br />

  **Response structure:** 

    ```javascript
    {
    "queriedEntity": {
        "actions": [ // corresponding buttons are created from this array
            {
                "name": "Edit", // name label on the button
                "url": "http://localhost:3000" // target URL
            },
            {
                "name": "Delete",
                "url": "http://localhost:3000"
            }
        ],
        "detail": ""  // string composed of HTML markup, displayed in the info card
    }
    }
    ```

  **Response example:**  
 
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