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
                ///...nodes to be displayed...
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
                //...nodes displayed as a legend///
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

  <_Just a sample call to your endpoint in a runnable format ($.ajax call or a curl request) - this makes life easier and more predictable._> 

* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._> 