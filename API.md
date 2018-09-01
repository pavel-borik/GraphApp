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
   `validityStart=[String]` - Initial date of the queried relationships in a YYYYMMDDTHHmm format  
   `validityEnd=[String]` - Final date of the queried relationships in a YYYYMMDDTHHmm format  
   `view=[String]` - Identifier of the view to display  
   

   **Optional:**

*   **Request example:**

    `/api/getdata?id=EIC_10YFI_1________U&type=mba&validityStart=20150101T0000&validityEnd=20180101T0000&view=ro,mga,tso,country`

*   **URL usage example:**

    `http://localhost:3000/getdata?id=EIC_10YFI_1________U&type=mba&validityStart=20150101T0000&validityEnd=20180101T0000&view=ro,mga,tso,country`

* **Data Params**

* **Success Response:**

  **Code:** 200 <br />

  **Response structure:**  

    ```javascript
    {
    "config": {
        "groups": { // definition of node groups
            "g1": { // group key
                "name": "Regulation Object", // group name, displayed in the legend
                "color": { // group color styling
                    "background": "#3cb44b", // node background color
                    "highlight": {
                        "background": "#ffbcbc" // node background color when clicked on
                    }
                }
            },
            "g2": { 
                "name": "Metering Grid Area",
                "color": { 
                    "background": "#ffe119", 
                    "highlight": { 
                        "background": "#ffbcbc" 
                    }
                },
            },
            // ...other group definitions...
        },
        "clustering": {  // description of clustering. Top level clusters have no parent key, subclusters do
            // !!! ID of top level cluster must be the same as some key in the groups object for correct styling !!!
            "g1": {
                "name": "Cluster g1\ncontains: {count}" // label of the cluster displayed on the cluster node
                                                        // {count} is replaced by the number of nodes in the cluster
            },
            "g2": {
                "name": "Cluster g2\ncontains: {count}"
            },
            "g1_1": {
                "name": "Subcluster\ng1_1\n with {count} items",
                "parent": "g1" // reference of the parent's key
            }, 
            "g1_2": {
                "name": "Subcluster\ng1_2\n with {count} items",
                "parent": "g1"
            },
            "g2_1": {
                "name": "Subcluster\ng2_1\n with {count} items",
                "parent": "g2"
            },
            "g2_1_1": {
                "name": "Subcluster\ng2_1_1\n with {count} items",
                "parent": "g2_1"
            },
            // ...
        },
        "range": { // validity dates, used by datepickers, YYYYMMDDTHHmm format
            "validityStart": "20150101T0000",
            "validityEnd": "20180101T0000"
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
                "label": "SC RO106", // label of the entity - displayed under the node in the vizualization
                "name" : "SC RO106", // name of the entity - displayed in the info card header
                "group": "g1", // reference of the group key in the config part - used for styling
                "type": "ro", // type identifier used for composing getDetail query URL (this should determine the target database table)
                "title": "<h3> ac3f6ea5-9bbf-11e8-a86c-1c6f65c3aae2 </h3><ul class=\"tooltip-list\"><li>Validity start: 2017-05-01T00:00</li><li>Validity end: 2018-09-01T00:00</li></ul>", // tooltip content (displayed after hovering over the node), in HTML markup
                "typeFullName": "Regulation Object" // displayed in the info card header
                "clustering": [ // Array of the whole subtree of (sub)clusters the node belongs to
                    "g1_1",
                    "g1"
                ]
            },
            {
                "id": "337ca5f2-ac58-11e8-81d2-1c6f65c3aae2",
                "internalId": "NFI_KYO001",
                "label": "Kyröskosken Voima voimalaitosverkko",
                "name": "Kyröskosken Voima voimalaitosverkko",
                "group": "g2",
                "type": "mga",
                "title": "<h3> Kyröskosken Voima voimalaitosverkko </h3><ul class=\"tooltip-list\"><li>Type: mga</li></ul>",
                "typeFullName": "Metering Grid Area",
                "clustering": [
                    "g2_1_2",
                    "g2_1",
                    "g2"
                ]
            },
            // ...other nodes definitions...
        ],
        "edges": [
            {
                "from": "ac3f6ea5-9bbf-11e8-a86c-1c6f65c3aae2", // id of the node
                "to": "337ca5f2-ac58-11e8-81d2-1c6f65c3aae2", // id of the node
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