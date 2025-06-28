import { SPECIAL } from "@prisma/client";

export const perksData: {
  name: string;
  description: string;
  requisite?: { special: string; value: number };
}[] = [
  // Strength Perks
  {
    name: "STRONG BACK",
    description:
      "Once per Turn, during its activation, this model may make the Rummage Action without Taking Fatigue.",
    requisite: { special: "STRENGTH", value: 3 },
  },
  {
    name: "BASHER",
    description:
      "When this model makes a Melee Attack, if the Weapon has the Pushback Critical Effect trait, increase its value by 2 until the Attack has resolved. Otherwise, it gains the Pushback (4) Critical effect until the Attack has resolved.",
    requisite: { special: "STRENGTH", value: 4 },
  },
  {
    name: "BIG LEAGUES",
    description:
      "When creating a Dice Pool for a Melee Attack, this model increases its Luck by 1 until the Attack has resolved.",
    requisite: { special: "STRENGTH", value: 4 },
  },
  {
    name: "DRAG",
    description:
      'After this model makes the Back Off Action, its controller may make a Drag Test (3S). For each Hit rolled, move a model that the moving model was Engaged with (at the beginning of the Back Off Action), into Base contact with the moving model. The normal rules for moving apply and the dragged model cannot be moved within 1" of an opposing model unless it can also be placed into Engagement with that model.',
    requisite: { special: "STRENGTH", value: 4 },
  },
  {
    name: "STEADY AIM",
    description:
      "When this model creates a Dice Pool for an Ranged Attack with a Rifle or Heavy Weapon, if it has not moved this Turn, they gain 1 Bonus Die.",
    requisite: { special: "STRENGTH", value: 4 },
  },
  {
    name: "MANCATCHER",
    description:
      "After this model Incapacitates an Enemy Champion crew member with a Melee Attack, its controller may make a Capture Test (1S). If Passed, the Incapacitated model is Captured and becomes a Captive, it does not roll on the Aftermath Table during the Story Phase. Otherwise, they are Incapacitated as normal.",
    requisite: { special: "STRENGTH", value: 5 },
  },
  {
    name: "CHARGE",
    description:
      "After performing a Get Moving Action, if this model is Engaged with an Enemy model, it may make a Brawl Action without Taking Fatigue.",
    requisite: { special: "STRENGTH", value: 5 },
  },
  {
    name: "WIDE SWINGS",
    description:
      "When creating a Dice Pool for a Melee Attack, this model gains 1 Bonus Die for each Enemy model it is Engaged with, beyond the first.",
    requisite: { special: "STRENGTH", value: 6 },
  },
  {
    name: "GRENADIER",
    description:
      'This model increases the Effective Range of Grenade Weapons it is armed with by 3".',
    requisite: { special: "STRENGTH", value: 6 },
  },
  {
    name: "IRON FIST",
    description:
      "This model gains the Iron Fist Weapon profile, in addition to its existing Weapon Sets. (WEAPON TYPE: Melee, TEST: 5S, TRAITS: Fast, CRITICAL EFFECT: Maim)",
    requisite: { special: "STRENGTH", value: 7 },
  },
  // Perception Perks
  {
    name: "WAYFINDER",
    description:
      "When Scouting as part of a Scout Story Action, this model makes the Scout Test at (3P), rather than (2P).",
    requisite: { special: "PERCEPTION", value: 3 },
  },
  {
    name: "HOBBLE",
    description:
      'Enemy models Damaged by this model during a Ranged Attack, with a Weapon without the Area (X") Trait, cannot be activated in the following Turn, unless all other models in the Enemy crew are Exhausted.',
    requisite: { special: "PERCEPTION", value: 3 },
  },
  {
    name: "SNIPER",
    description:
      "When this model makes a Ranged Attack with a Rifle weapon, Enemy models cannot be Obscured by intervening models.",
    requisite: { special: "PERCEPTION", value: 4 },
  },
  {
    name: "OVERWATCH",
    description:
      "When this model makes a Ranged Attack, if the Target Model moved in the previous Turn, it is Wide Open until the attack has resolved.",
    requisite: { special: "PERCEPTION", value: 4 },
  },
  {
    name: "SPOTTER",
    description:
      "Friendly models within the Control Area of one or more models with this Perk may Re-roll one dice when making the Rummage Action.",
    requisite: { special: "PERCEPTION", value: 4 },
  },
  {
    name: "PENETRATOR",
    description:
      "When this model makes a Ranged Attack (with a Weapon without the Area trait) against a Target model with an Endurance score of 5 or more, reduce the Target model's Endurance by 1, until the Attack has resolved.",
    requisite: { special: "PERCEPTION", value: 5 },
  },
  {
    name: "PICKPOCKET",
    description:
      "When this model makes a Back Off Action, its controller may make a Pickpocket Test (3P). If Passed, the opposing player removes one dose of a Chem they have on their Crew Roster, it has been stolen. The Active player then adds one dose of the same Chem to their own Roster, if they have capacity. If the Test scores 3 or more Hits, the Active player can choose which Chem is stolen, instead of the opposing player.",
    requisite: { special: "PERCEPTION", value: 5 },
  },
  {
    name: "CALLED SHOT",
    description:
      "When this model makes a Ranged Attack with a Pistol or Rifle, if the Weapon has the Aim Trait, increase its value by 2 until the Attack has resolved. Otherwise, it gains the Aim (+2) Trait until the Attack has resolved.",
    requisite: { special: "PERCEPTION", value: 6 },
  },
  {
    name: "RIFLEMAN",
    description:
      "When creating a Dice Pool for a Ranged Attack with a Rifle Weapon, this model increases its Luck by 1 (to a maximum of 3) until the Attack has resolved.",
    requisite: { special: "PERCEPTION", value: 6 },
  },
  {
    name: "AWARENESS",
    description:
      "When a friendly model makes an Open Fire Action, this model can provide Supporting Fire even if it is not within the Attacking model's Control Area. All other restrictions still apply.",
    requisite: { special: "PERCEPTION", value: 7 },
  },
  // Endurance Perks
  {
    name: "STONEWALL",
    description: 'This model\'s Proximity area is 2", rather than 1".',
    requisite: { special: "ENDURANCE", value: 3 },
  },
  {
    name: "SELFLESS",
    description:
      'If this model is a Target model of an Attack from a Weapon with the Area (X") Trait, before the Attack Test is made, its controller may declare that it is Shielding Others. If it does, the Attack is resolved with this model as the only Target, and the Dice Pool gains a Bonus Die.',
    requisite: { special: "ENDURANCE", value: 3 },
  },
  {
    name: "RAD RESISTANT",
    description: "This model is unaffected by Radiation Tokens.",
    requisite: { special: "ENDURANCE", value: 4 },
  },
  {
    name: "IMMORTAL",
    description:
      "When a player rolls on the Serious Injury Table for this model, roll an extra die and choose a result.",
    requisite: { special: "ENDURANCE", value: 4 },
  },
  {
    name: "BULLET MAGNET",
    description:
      "When making a Ranged Attack against your models, Enemy models must Target this model if it is the closest Visible Friendly model that can be Targeted. If a model has the Unassuming Perk, it cannot take this Perk.",
    requisite: { special: "ENDURANCE", value: 5 },
  },
  {
    name: "ODD ANATOMY",
    description:
      "When this model is the Target of an Enemy Attack, during the Trigger Critical Effect step its controller may make a Shrug Test (2E). If a number of Hits are rolled equal to, or greater than, the number of Luck Dice left in the Attacker's Dice Pool, no Critical Effects can be triggered until the Attack has resolved.",
    requisite: { special: "ENDURANCE", value: 5 },
  },
  {
    name: "CANNIBAL",
    description:
      "When a model is Incapacitated while in Base contact with this model, this model Recovers all Harm.",
    requisite: { special: "ENDURANCE", value: 5 },
  },
  {
    name: "TOUGHNESS",
    description:
      "The first time that this model would be Incapacitated each Game, its controller may make a Toughness Test (2E). If Passed, this model Takes Harm up to its Harm Limit, but is not Incapacitated (if this model would have been Incapacitated by an Injury, that Injury is removed from the Injury Box on the model's Roster Entry).",
    requisite: { special: "ENDURANCE", value: 6 },
  },
  {
    name: "UNENDING STAMINA",
    description:
      "Once per Round, when this Model is Exhausted, its controller may declare it is performing a Relentless Action at the beginning of their Turn, before choosing an Active Model. If they do, this model becomes the Active Model (ignoring the standard rules for selecting an Active Model) and may perform 1 Action without Taking Fatigue. At the end of the Relentless Action, this model Suffers 1 Injury.",
    requisite: { special: "ENDURANCE", value: 6 },
  },
  {
    name: "LIFEGIVER",
    description: "At the start of each Round, this model Recovers 2 Harm.",
  },
  // Charisma Perks
  {
    name: "WARDEN",
    description:
      "When a player makes a Captive Story Action, if their crew possesses one or more models with this Perk that are not marked as Absent, they may roll twice when determining the Score on their Faction's Captive Table, picking whichever of the two results they choose.",
    requisite: { special: "CHARISMA", value: 3 },
  },
  {
    name: "FAST TALKER",
    description:
      "If this model is Captured or becomes a Captive, its controller may make a Charm Test (2C). If Passed, the model talks their way out of it and does not become a Captive, it is not listed on the opponents Captives Roster, and it is not listed as Absent on the controllers Crew Roster.",
    requisite: { special: "CHARISMA", value: 3 },
  },
  {
    name: "LIEUTENANT",
    description:
      "During the Story Phase, if no model in a crew containing this model has the Natural Leader Perk, this model loses this Perk and gains the Natural Leader Perk. You may then Upgrade this model twice, as described in the Crew Training Story Action. These Upgrades do not cost any XP and do not count toward the model's Upgrade Limit.",
    requisite: { special: "CHARISMA", value: 4 },
  },
  {
    name: "INSPIRATIONAL",
    description: "Increase this model's Control Area by 2\".",
    requisite: { special: "CHARISMA", value: 4 },
  },
  {
    name: "LONE WANDERER",
    description:
      "When creating a Dice Pool for any test for this Model, if there are no other Friendly models in its Control Area, add 2 Bonus Dice to the Pool.",
    requisite: { special: "CHARISMA", value: 5 },
  },
  {
    name: "UNASSUMING",
    description:
      "When making a Ranged Attack against your models, Enemy models cannot Target this model, if there is a closer visible Friendly model that can be targeted. If a model has the Bullet Magnet Perk, it cannot take this Perk.",
    requisite: { special: "CHARISMA", value: 5 },
  },
  {
    name: "PARTYBOY/GIRL",
    description:
      "When a Chem is used on this model, it may either: Recover all Harm; or Recover 1 Injury.",
    requisite: { special: "CHARISMA", value: 5 },
  },
  {
    name: "INTIMIDATION",
    description:
      "When an Enemy model is subjected to a Confusion Test while within this model's Control Area, the Enemy model's Intelligence is reduced by 1, until the Confusion Test has Resolved.",
    requisite: { special: "CHARISMA", value: 6 },
  },
  {
    name: "ANIMAL FRIEND",
    description:
      "At the start of a game, you may deploy a Dog in Base contact with this model. It is treated as a Friendly model for the rest of the game. It counts as a member of your crew but is removed at the end of a game.",
    requisite: { special: "CHARISMA", value: 6 },
  },
  {
    name: "CAP COLLECTOR",
    description:
      "When this model makes the Rummage Action to Find Caps and Parts, after rolling the dice, double the number of Caps received. In addition, when performing the Barter Story Action, if your crew possesses one or more models with this Perk that are not marked as Absent, double the number of Caps received.",
    requisite: { special: "CHARISMA", value: 7 },
  },
  // Intelligence Perks
  {
    name: "ADAPTABLE",
    description:
      "Once per game, when creating this model's Dice Pool for a S.P.E.C.I.A.L. Test, you may use this model's Intelligence in place of any other Statistic for that Test.",
    requisite: { special: "INTELLIGENCE", value: 3 },
  },
  {
    name: "SAVANT",
    description:
      "When performing the Crew Training Story Action to purchase an Upgrade for this model, reduce the XP cost by 2.",
    requisite: { special: "INTELLIGENCE", value: 4 },
  },
  {
    name: "INFORMANT",
    description:
      "When Setting up a Game, after completing the Starting Positions step of an Objective (or Scenario), if this model is on the Battlefield, its controller may Reposition a number of Friendly models equal to its Luck statistic. If both crews have model with this Perk, the player with the Initiative Token may choose who Repositions their models first.",
    requisite: { special: "INTELLIGENCE", value: 4 },
  },
  {
    name: "SCRAPPER",
    description:
      "When this model makes the Rummage Action to Find Caps and Parts, after rolling the dice, double the number of Caps and Parts added to the crew's Stash.",
    requisite: { special: "INTELLIGENCE", value: 4 },
  },
  {
    name: "CHEMIST",
    description:
      "When Setting up a Game, at the Preparing Advantage step, if a crew contains this model (and it is not Absent), its controller may add a single dose of any Common Chem with a Caps cost of 10 or less to their crew roster.",
    requisite: { special: "INTELLIGENCE", value: 5 },
  },
  {
    name: "STRATEGIST",
    description:
      "When a crew containing one or more models (which are not marked as Absent) with this Perk would spend 1 or more Scouting Points, the crew controller may make a Strategy Test (1I). If passed, the crew gains 1 Scouting Point.",
    requisite: { special: "INTELLIGENCE", value: 5 },
  },
  {
    name: "MEDIC",
    description:
      'When this model makes a Patch Up Action, instead of recovering 2 Harm from itself, it may either; Recover 3 Harm, or Recover 3 Harm from a Friendly model within 1".',
    requisite: { special: "INTELLIGENCE", value: 6 },
  },
  {
    name: "TRIGONOMETRY",
    description:
      'When creating the Dice Pool for a Ranged Attack with this model, if it is at least 2" higher in elevation than its Target, add 2 Bonus Dice to the Pool.',
    requisite: { special: "INTELLIGENCE", value: 6 },
  },
  {
    name: "CORONER",
    description:
      "During the Treat the Wounded Step of the Story Phase, if a crew has one or more models with this Perk (who are not Absent), whenever a friendly model rolls either the Broken (Aftermath Table), or Dead (Serious Injury Table) results, its controller may make an Autopsy Test (2I). If Passed, the crew gains 1XP for each Hit rolled.",
    requisite: { special: "INTELLIGENCE", value: 6 },
  },
  {
    name: "GUN NUT",
    description:
      "At the end of the Make Story Actions step of the Story Phase, if a crew has one or more models with this Perk (who are not Absent), its controller may spend Parts to Modify a single Weapon.",
    requisite: { special: "INTELLIGENCE", value: 7 },
  },
  // Agility Perks
  {
    name: "SPRINT",
    description:
      'When this model uses the Get Moving Action, it may move an extra 2".',
    requisite: { special: "AGILITY", value: 3 },
  },
  {
    name: "PARTING SHOT",
    description:
      "After making a Back Off Action to move out of an Enemy model's proximity, this model may make a Ranged Attack using a Pistol Weapon against that model, without Taking Fatigue.",
    requisite: { special: "AGILITY", value: 4 },
  },
  {
    name: "HIDDEN",
    description:
      "This model does not need to be deployed as normal. At the start of the first Round, its controller may place this model anywhere on the Battlefield that isn't within an Enemy model's Control Area.",
    requisite: { special: "AGILITY", value: 4 },
  },
  {
    name: "BLITZ",
    description:
      'After this model completes a Brawl Action, its controller may move it up to 3".',
    requisite: { special: "AGILITY", value: 4 },
  },
  {
    name: "GUNSLINGER",
    description:
      'This model increases the Effective Range of Pistol Weapons it is armed with by 4".',
    requisite: { special: "AGILITY", value: 5 },
  },
  {
    name: "FIRE AND MOVE",
    description:
      'After this model completes an Open Fire Action, its controller may move it up to 4".',
    requisite: { special: "AGILITY", value: 6 },
  },
  {
    name: "HIT THE DECK",
    description:
      "When making a Ranged Attack against your models, Enemy models cannot Target this model, unless it is either Wide Open, or has a Fatigue Token.",
    requisite: { special: "AGILITY", value: 6 },
  },
  {
    name: "GUNS AKIMBO",
    description:
      "When this model makes an Attack Action with a Pistol, if that Weapon does not have the Fast Trait, it gains the Fast Trait until the Attack has resolved.",
    requisite: { special: "AGILITY", value: 6 },
  },
  {
    name: "REFLEXES",
    description:
      "When an Enemy model moves into this model's Proximity, this model may make a Reaction Test (2A). If Passed, this model may make a Ranged Attack with a Weapon without the Slow Trait against the Enemy model.",
    requisite: { special: "AGILITY", value: 7 },
  },
  {
    name: "MOVING TARGET",
    description:
      "When this model becomes the Target of an Enemy Attack, its controller may declare it is Dodging. If they do, this model Takes 1 Fatigue, but increases its Endurance by 2 until the attack has resolved.",
    requisite: { special: "AGILITY", value: 7 },
  },
  // Luck Perks
  {
    name: "MALFUNCTION",
    description:
      "If an Enemy Ranged Attack Targeting this model scores 0 Hits, the Attacking Model Suffers 1 Harm.",
    requisite: { special: "LUCK", value: 2 },
  },
  {
    name: "RICOCHET",
    description:
      "If an Enemy Ranged Attack Targeting this model scores 0 Hits, this model's controller may choose a different model within 6\" to become the Target of a Ricochet. The Attacker Re-rolls the Attack Test against the Ricochet Target, as if it were the original Target of the Attack.",
    requisite: { special: "LUCK", value: 2 },
  },
  {
    name: "FORTUNE FINDER",
    description:
      "After this model resolves a Rummage Action, its controller rolls a die and gains Caps equal to its result.",
    requisite: { special: "LUCK", value: 2 },
  },
  {
    name: "LEND LUCK",
    description:
      "Attacks made by Friendly models against Enemy Targets within 3\" of this model, may use this model's Luck statistic when creating a Dice Pool, instead of their own Luck.",
    requisite: { special: "LUCK", value: 3 },
  },
  {
    name: "LUCKY CHARM",
    description:
      "When this model's controller uses a Ploy, if they have no Ploy Tokens left, they may make a Luck Test (4L). If Passed, the crew gains 1 Ploy Token.",
    requisite: { special: "LUCK", value: 3 },
  },
  {
    name: "FOUR LEAF CLOVER",
    description:
      "During the Fortune Smiles Step of a S.P.E.C.I.A.L. Test, this model rolls 2 Standard Dice for each Luck Die remaining in the Pool, instead of one.",
    requisite: { special: "LUCK", value: 3 },
  },
  {
    name: "BLOODY MESS",
    description:
      'If this model Incapacitates an Enemy model with an Attack, each other Enemy model within 2" of the Incapacitated model Suffers 1 Harm.',
    requisite: { special: "LUCK", value: 3 },
  },
  {
    name: "GRIM REAPER'S SPRINT",
    description:
      "When this Model Incapacitates an Enemy model with an Attack, if at least two Luck Dice Hit, this Model Recovers 1 Fatigue.",
    requisite: { special: "LUCK", value: 4 },
  },
  {
    name: "BETTER CRITICALS",
    description:
      "When this model triggers a Critical Effect with a numerical value, such as Ignite (X), increase that value by 2 until the Attack is resolved.",
    requisite: { special: "LUCK", value: 4 },
  },
  {
    name: "MYSTERIOUS STRANGER",
    description:
      "At the start of each Round after the first, this model's controller may make a Mysterious Stranger Test (1L). If Passed, that player deploys a friendly Mysterious Stranger model in Base contact with the edge of the Battlefield closest to this model. Once a player has passed a Mysterious Stranger Test, they may not attempt it again that game. The Mysterious Stranger is counted as part of its controller's crew, but is removed from the roster at the end of the game.",
    requisite: { special: "LUCK", value: 4 },
  },
  // Innate Perks
  {
    name: "BEAST",
    description: "This model cannot be a crew's Leader and never gains Perks.",
  },
  {
    name: "BURLY",
    description: "This model's Harm Limit is 4 instead of 3.",
  },
  {
    name: "HARDY",
    description:
      "This model cannot Suffer Fatigue. It can still Take Fatigue by performing Actions, or other effects.",
  },
  {
    name: "KNOW YOUR ENEMY",
    description:
      "When creating the Dice Pool for an Attack Action against an Enemy model from X Faction, this model gains 1 Bonus Dice. If a model gains this Perk, their controller picks the applicable Faction at that time.",
  },
  {
    name: "MACHINE",
    description:
      "This model always passes any Confusion Test it is required to make. When this model is Incapacitated, it does not trigger Confusion Tests in other models. In addition, Chems cannot be used on this model, and it is unaffected by the Poison (X) and Tranquilize (X) Critical Effects. Finally, this model is unaffected by Radiation Tokens.",
  },
  {
    name: "NATURAL LEADER",
    description:
      "This model automatically Passes Confusion Tests. When making an Intelligence Test for a Friendly model within this model's Control Area, you can choose to use this model's Intelligence value instead of the model's own value. When choosing a Leader at the start of a game, this model must be chosen if it is possible to do so. If there is more than one model with this Perk in the crew, the player must choose one of them.",
  },
  {
    name: "OUTSIDER",
    description:
      "This model's weapon cannot be modified using the Modify Weapons Story Action, and they cannot be upgraded using the Crew Training Story Action. This model does not count toward or affect any Crew Limits. If this model is a Champion, it does not allow a crew to take 5 more Grunts. In addition, the model does not count as a Friendly model for the purposes of Confusion Tests.",
  },
  {
    name: "PERSONAL STASH",
    description:
      "If a crew has one or more models with this Perk (who are not Absent), when purchasing Common Chems, reduce their costs by 3 Caps.",
  },
  {
    name: "POWER ARMOR",
    description:
      "This model gains the following benefits: This model cannot Suffer Fatigue. It can still Take Fatigue by performing Actions, or other effects. This model's Harm Limit is 4 instead of 3. This model is unaffected by Radiation Tokens.",
  },
  {
    name: "SIC 'EM",
    description:
      "When a friendly model makes a Get Moving Action, this model can be given Movement Orders even if it is not within the Active model's Control Area. All other restrictions still apply.",
  },
  {
    name: "STICKY FINGERS",
    description:
      "When this model makes the Rummage Action to Find a Chem, after adding a Chem to the Crew Roster, they may add a second Chem with a Cap cost no higher than the total result of the two rolled dice.",
  },
  {
    name: "SURVIVALIST",
    description:
      'Whenever this model would Suffer Harm from an Attack, and there is another Friendly model within 3" that has no Harm, the Friendly model may Suffer that Harm instead.',
  },
  {
    name: "V.A.T.S.",
    description:
      "After declaring an Attack Action with this model, but before creating the Dice Pool, you may declare the number of Hits you expect to roll. During the Remove Duds step, if your declared number matches the number of Hits left in the Pool, then each Hit counts as 2 Hits instead.",
  },
];

export const specialMap: Record<string, SPECIAL> = {
  STRENGTH: "S",
  PERCEPTION: "P",
  ENDURANCE: "E",
  CHARISMA: "C",
  INTELLIGENCE: "I",
  AGILITY: "A",
  LUCK: "L",
};
