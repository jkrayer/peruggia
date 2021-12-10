# peruggia

A cli tool for extracting notes from Fantasy Grounds.

## The Plan

1.  The goal of the project is a CLI tool to cull notes from a Fantasy Grounds DB and write md files... probably for 11ty.

- It also may need to categorize
- Follow or Add Links and write accordingly

2.  In the future it may also need to cull and write player logs.

### Assumptions

- Could it search the default path? For mac that would be /users/[currentuser]/SmiteWorks/Fantasy\ Grounds/campaigns/[campaignName]/db.xml
- I expect the user to type campainName correcty
- I expect Node to get [currentuser], which is may not be able to do... ...but it can do ~/SmiteWorks
- I also expect the user to provide an output folder to write the notes to... They will be named NoteName.md

## Out of Scope Ideas

- And Permissionify those logs
- and then the app would need Permissions...

_(Vincent Peruggia famously stole the Mona Lisa from the Louvre in 1911.)_
