ok we are going to plan this application we already have authentication and organizations in place.

the application is to track crews in the fallout factions wargame.

## the first step is going to be to establish the data schema.

1. Ask all questions required to clarify what is to be done.
2. once satisfied write down the conclusions into a markdown file with a link from the Readme.md file to navigate to it.

- each organization member is a player regardless of their role.
- each player can have many crews.
- a crew comprises of units represented by a model
  - each unit has a class.
  - each unit has multiple weapons that can be upgraded ;multiple times.

A crew roster and story sheet are included as screen shot .

- each unit
  - has `S`,`P`,`E`,`C`,`I`,`A`,`L` attributes with values ranging from 1 to 15
  - multiple perks (table)
  - upgrades (table)
  - a rating value
  - a name
  - they can be marked absent
  - they can have multiple injuries
- the model is the physical representation of the unit.

  - for now it will only have a description

- weapons have

  - a type (table)
  - a test value or values (number of dics, attribute)
  - multiple traits (table)
  - multiple critical traits (table)
  - they have a set list of possible upgrades that will change the abve values making the weapons unique to each unit but will be selected form a main table of options.

- rosters themselves

  - crew name
  - Faction (table)
  - Player
  - stash
    - Caps (number)
    - Parts (number)
    - Scout (number)
    - Reach (number)
    - XP (number)
    - chems
      - can be rare or commun
      - a number of available
  - Limits
    - Upgrades (number)
    - Champions (number)
    - Facilities (number)
  - Rivals (a link to other crews)
    - crew name
    - player name
    - games played
  - Prisoners (link to Units)
    - Name
    - Player
  - a QuestLine
    - multiple Quests
      - tier Number
      - Target (number)
      - Progress (number)

  Ask questions to clarify any points that are unclear.
  draw a mermaid schema for the database in markdown.
