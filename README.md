# Shopping Cart Assignment
## Description
<img src="images/screenshot1.png" width="800" alt="shopping cart landing page view">

This repository houses the Shopping Cart assignment, which utilizes a locally hosted Strapi DB to "restock" a basic shopping cart. 

<img src="images/screenshot3.png" width="800" alt="shopping cart landing page view">

Per the requirements, additional rows are added to the bottom of the Product List, which extnds down the page.

<img src="images/screenshot2.png" width="800" alt="shopping cart view with ">

Small functional and styling enhancements were made beyond the original requirements, including the following:
* Updated the individual product listing styling.
* Consolidated all like-products to a single entry in the checkout area. Each entry contains a count of items and total price for that item type.
* Updated the individual product listing styling.
* (Note the addition of a stock image query for all images was a part of the original requirements list)


## Installation & Dependencies
To install, download all files and run index.html from a local server. 
* Utilization of the restock functionality will require the use of a local CMS, like [Strapi](https://strapi.io/), on port 1337. 
* To utilize the Restock Products field, create a table with the below populated fields. 
### Mandatory DB Fields


| Field      | Type   | Description         |
| ---------- | ------ | ------------------- |
| name       | Text   | Product name        |
| country    | Text   | Country of origin   |
| cost       | Int    | Product cost        |
| stock      | Int    | Starting inventory  |

## License Information
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Each repository needs a description, how to install, dependencies, how to run, license info…