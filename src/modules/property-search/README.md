# Property Search Module

Includes:
- Filters: location, price, beds, baths, type, DOM
- Results list
- Listing Information:
  - ATTOM Property Data
  - MLS RETS/RESO Listing Data

Integration notes:
- ATTOM: use centralized ATTOM key via server function proxies where possible.
- MLS RETS/RESO: access via brokerage/board credentials and RESO Web API; implement server-side adapters.

Next steps:
- Implement search handlers: onSearch -> call server endpoints for Attom + MLS
- Merge/display results with clear source indicators
- Add favorite/save + alerts

