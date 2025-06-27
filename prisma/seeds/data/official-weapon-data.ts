import { SPECIAL } from "@prisma/client";

export type WeaponSeed = {
  name: string;
  base: {
    weaponType: string;
    range: string;
    rating: number;
    testValue: number;
    testAttribute: SPECIAL;
    traits?: string[];
    criticalEffects?: string[];
    notes?: string;
  };
  upgrades?: {
    name: string;
    cost: number;
    ratingNew?: number;
    testValueNew?: number;
    rangeNew?: string;
    traits?: string[];
    criticalEffects?: string[];
  }[];
};

export const weapons: WeaponSeed[] = [
  {
    name: "Hand Weapon",
    base: {
      weaponType: "Melee",
      range: "1",
      rating: 3,
      testValue: 3,
      testAttribute: "S",
      traits: ["Fast"],
      notes:
        "Never go into the Wasteland without something you can swing in your hand. I don't care if it's something fancy like a sword or basic like a pipe... just don't go wandering around empty handed.",
    },
    upgrades: [
      {
        name: "Hone Edge",
        cost: 3,
        ratingNew: 4,
        testValueNew: 4,
        traits: ["Fast"],
        criticalEffects: ["Maim"],
      },
    ],
  },
  {
    name: "Baseball Bat",
    base: {
      weaponType: "Melee",
      range: "1",
      rating: 5,
      testValue: 3,
      testAttribute: "S",
      traits: ["Wind Up"],
      criticalEffects: ["Suppress (X)"],
      notes:
        "These things were part of a brutal bloodsport played by people before the war. They run around a field and smack each other with them. Sounds fun. Wanna try?",
    },
    upgrades: [
      {
        name: "Swing for the Fences",
        cost: 2,
        ratingNew: 5,
        testValueNew: 4,
        traits: ["Wind Up"],
        criticalEffects: [],
      },
    ],
  },
  {
    name: "Machete",
    base: {
      weaponType: "Melee",
      range: "1",
      rating: 5,
      testValue: 4,
      testAttribute: "S",
      criticalEffects: ["Maim"],
      notes:
        "You just can't beat the classics. It chops, it lops, and it's real easy to clean. A good Machete'll make quick work of anyone or anythin' you plant it in.",
    },
    upgrades: [
      {
        name: "Sharpen Blade",
        cost: 2,
        ratingNew: 6,
        testValueNew: 5,
        traits: [],
        criticalEffects: ["Maim"],
      },
    ],
  },
  {
    name: "Officer's Sword",
    base: {
      weaponType: "Melee",
      range: "1",
      rating: 5,
      testValue: 4,
      testAttribute: "S",
      traits: ["Fast"],
      criticalEffects: ["Pierce"],
      notes:
        "This is a relic from back in the days of the war – be careful when waving it around! It'll take off both your fingers and the head of the person next to you in no time at all.",
    },
    upgrades: [
      {
        name: "Serrated Edge",
        cost: 2,
        ratingNew: 6,
        testValueNew: 5,
        traits: ["Fast"],
        criticalEffects: ["Pierce"],
      },
      {
        name: "Weighted Hilt",
        cost: 3,
        ratingNew: 5,
        traits: ["Fast"],
        criticalEffects: ["Pierce", "Suppress (X)", "Suppress (X)"],
      },
    ],
  },
  {
    name: "Ripper",
    base: {
      weaponType: "Melee",
      range: "1",
      rating: 7,
      testValue: 5,
      testAttribute: "S",
      traits: ["Fast"],
      criticalEffects: ["Maim"],
      notes:
        "No aspirant's training is complete until they know how to use a knife. No knight's training is complete until they know how to use a ripper. Fitted with a rotary chain, the ripper is a handheld tool that can be used in both fieldwork and wetwork.",
    },
    upgrades: [
      {
        name: "Extended Chain",
        cost: 4,
        ratingNew: 8,
        traits: ["Fast"],
        criticalEffects: ["Maim", "Pierce"],
      },
    ],
  },
  {
    name: "Claws & Jaws",
    base: {
      weaponType: "Melee",
      range: "1",
      rating: 4,
      testValue: 4,
      testAttribute: "S",
      traits: ["Fast"],
      criticalEffects: ["Suppress (X)"],
      notes:
        "Careful of the dog, she'll 'ave your hand off right quick given t'chance.",
    },
  },
  {
    name: "Sledgehammer",
    base: {
      weaponType: "Melee",
      range: "1",
      rating: 5,
      testValue: 4,
      testAttribute: "S",
      traits: [
        "Unwieldy (X)",
        "Unwieldy (X)",
        "Unwieldy (X)",
        "Unwieldy (X)",
        "Unwieldy (X)",
        "Wind Up",
      ],
      criticalEffects: ["Maim"],
      notes:
        "Real easy for us Super Mutants to pick up this one. Weak humans need both hands to hold it. Makes things crunch real good.",
    },
    upgrades: [
      { name: "Reinforced Handle", cost: 2, testValueNew: 5, ratingNew: 6 },
      {
        name: "Puncturing Head",
        cost: 3,
        ratingNew: 6,
        criticalEffects: ["Suppress (X)"],
      },
    ],
  },
  {
    name: "Super Sledge",
    base: {
      weaponType: "Melee",
      range: "1",
      rating: 8,
      testValue: 6,
      testAttribute: "S",
      traits: [
        "Unwieldy (X)",
        "Unwieldy (X)",
        "Unwieldy (X)",
        "Unwieldy (X)",
        "Unwieldy (X)",
        "Unwieldy (X)",
      ],
      criticalEffects: ["Maim"],
      notes:
        "Ha! Ha! This hammer has a rocket in it. It swings really hard and makes the puny humans explode! They'd get tired if they were swinging it but not us Super Mutants!",
    },
    upgrades: [
      {
        name: "Kinetic Dynamo",
        cost: 3,
        ratingNew: 7,
        // This should add the "Wind Up" trait to the upgrade itself
      },
      {
        name: "Concussive Force",
        cost: 3,
        ratingNew: 7,
        criticalEffects: ["Suppress (X)"],
      },
    ],
  },
  {
    name: "10mm Pistol",
    base: {
      weaponType: "Pistol",
      range: "12",
      rating: 4,
      testValue: 3,
      testAttribute: "A",
      traits: ["CQB (Close-Quarters-Battle)", "Fast"],
      notes:
        "Would recommend this firearm if you're looking for something that can be modified with ease. Even without any changes, a 10mm pistol can fire ammunition at a respectable speed.",
    },
    upgrades: [
      { name: "Extended Barrel", cost: 2, ratingNew: 4, rangeNew: "14" },
      { name: "Calibrated Receiver", cost: 4, ratingNew: 6, testValueNew: 4 },
      {
        name: "Suppressor",
        cost: 2,
        ratingNew: 5,
        criticalEffects: ["Suppress (X)"],
      },
    ],
  },
  {
    name: ".44 Pistol",
    base: {
      weaponType: "Pistol",
      range: "16",
      rating: 5,
      testValue: 4,
      testAttribute: "A",
      traits: ["Aim (+X)"],
      criticalEffects: ["Pierce"],
      notes:
        "Wanna feel like an old-world cowboy? Grab a .44. Reliable, powerful and damn cool-lookin'. Saw a real mysterious guy with one once – one day, I'll nab it off 'im.",
    },
    upgrades: [
      { name: "Long Barrel", cost: 3, ratingNew: 10, rangeNew: "18" },
      {
        name: "Refined Sights",
        cost: 3,
        ratingNew: 6,
        traits: ["Aim (+X)", "Aim (+X)"],
      },
    ],
  },
  {
    name: "Crusader Pistol",
    base: {
      weaponType: "Pistol",
      range: "12",
      rating: 6,
      testValue: 4,
      testAttribute: "A",
      criticalEffects: ["Maim"],
      notes:
        "The Crusader pistol is a treasured sidearm in our order. Reliable and able to fire a variety of ammo types. It comes with our logo on the side, so you never forget what you're fighting for.",
    },
    upgrades: [
      {
        name: "Incendiary Receiver",
        cost: 3,
        ratingNew: 7,
        criticalEffects: ["Maim", "Ignite (X)"],
      },
      { name: "Custom Grip", cost: 2, ratingNew: 6, criticalEffects: ["Maim"] },
    ],
  },
  {
    name: "Heavy Pipe Pistol",
    base: {
      weaponType: "Pistol",
      range: "10",
      rating: 3,
      testValue: 4,
      testAttribute: "A",
      traits: ["CQB (Close-Quarters-Battle)"],
      criticalEffects: ["Pierce"],
      notes:
        "A pipe pistol's a good choice for someone looking for a simple, reliable firearm. But what about when it's just not hitting hard enough? Put a bigger pipe on it! Simple!",
    },
    upgrades: [
      {
        name: "Extended Pipe",
        cost: 3,
        ratingNew: 4,
        rangeNew: "12",
        traits: [],
      },
      {
        name: "Refined Pipe",
        cost: 3,
        ratingNew: 4,
        traits: ["CQB (Close-Quarters-Battle)"],
      },
    ],
  },
  {
    name: "Pipe Revolver",
    base: {
      weaponType: "Pistol",
      range: "12",
      rating: 4,
      testValue: 4,
      testAttribute: "A",
      traits: ["Aim (+X)"],
      criticalEffects: ["Suppress (X)"],
      notes:
        "The most advanced form a pipe gun can take, some may find these weapons to be cumbersome. They may be right, but these revolvers make up for it in their surprising accuracy.",
    },
    upgrades: [
      { name: "Long Barrel", cost: 2, ratingNew: 6, rangeNew: "14" },
      {
        name: "Sharpshooter's Grip",
        cost: 2,
        ratingNew: 6,
        traits: ["Aim (+X)", "Aim (+X)"],
      },
    ],
  },
  {
    name: "Junk Jet",
    base: {
      weaponType: "Heavy Weapon",
      range: "8",
      rating: 4,
      testValue: 3,
      testAttribute: "S",
      traits: ["Creative Projectiles"],
      criticalEffects: ["Suppress (X)"],
      notes:
        "This thing fires JUNK! Actual trash! It's great fun, but be careful where you're pointing it. That trash comes out with some real oomph.",
    },
  },
  {
    name: "Flamer",
    base: {
      weaponType: "Heavy Weapon",
      range: "8",
      rating: 6,
      testValue: 3,
      testAttribute: "P",
      traits: ['Area (X")', 'Area (X")', "CQB (Close-Quarters-Battle)"],
      criticalEffects: ["Ignite (X)"],
      notes:
        "When you wanna make sure something's dead, you can't go wrong with a flamer. These things'll burn through just about anythin'.",
    },
  },
  {
    name: "Assault Rifle",
    base: {
      weaponType: "Rifle",
      range: "20",
      rating: 6,
      testValue: 4,
      testAttribute: "P",
      traits: ["Storm (+X)"],
      criticalEffects: ["Maim"],
      notes:
        "This is good gun for super mutant! It shouts loud and kills fast! Too big for humans to use properly, but for us, it can be used with hammer or axe. Shoot until close, and then bash to death!",
    },
    upgrades: [
      {
        name: "Boosted Servos",
        cost: 3,
        ratingNew: 8,
        testValueNew: 5,
      },
      {
        name: "Automatic Receiver",
        cost: 5,
        ratingNew: 12,
        traits: ["Fast", "Storm (+X)"],
      },
    ],
  },
  {
    name: "Laser Rifle",
    base: {
      weaponType: "Rifle",
      range: "18",
      rating: 5,
      testValue: 4,
      testAttribute: "P",
      criticalEffects: ["Ignite (X)"],
      notes:
        "The laser rifle embodies everything we value in a weapon. It deals high damage at increased ranges without any drop in accuracy. The snap of a laser rifle is the closest thing we have to a hello for our enemies.",
    },
    upgrades: [
      {
        name: "Long Barrel",
        cost: 2,
        ratingNew: 7,
        rangeNew: "22",
      },
      {
        name: "Gyro-Compensating Lens",
        cost: 3,
        ratingNew: 8,
        traits: ["Fast"],
      },
    ],
  },
  {
    name: "Laser Musket",
    base: {
      weaponType: "Rifle",
      range: "24",
      rating: 6,
      testValue: 4,
      testAttribute: "P",
      traits: ["Aim (+X)"],
      criticalEffects: ["Ignite (X)"],
      notes:
        "An old-world classic with a new-world twist. Just be careful how many times you turn that crank... these things have a habit of exploding.",
    },
    upgrades: [
      {
        name: "Charging Barrels",
        cost: 4,
        ratingNew: 8,
        traits: ["Aim (+X)", "Slow"],
        criticalEffects: ["Ignite (X)"],
      },
    ],
  },
  {
    name: "Gauss Rifle",
    base: {
      weaponType: "Rifle",
      range: "30",
      rating: 8,
      testValue: 6,
      testAttribute: "P",
      traits: ["Aim (+X)"],
      criticalEffects: ["Pierce", "Maim"],
      notes:
        "This weapon uses magnetic induction to propel a projectile at a devastating speed. Recommended for our most senior members, and only with a steady hand.",
    },
    upgrades: [
      {
        name: "Shielded Barrel",
        cost: 3,
        ratingNew: 10,
        traits: ["Aim (+X)"],
        criticalEffects: ["Pierce", "Maim"],
      },
      {
        name: "Capacitor Boosting Coil",
        cost: 5,
        ratingNew: 8,
        traits: ["Aim (+X)"],
        criticalEffects: ["Pierce", "Maim", "Suppress (X)"],
      },
    ],
  },
  {
    name: "Gatling Laser",
    base: {
      weaponType: "Heavy Weapon",
      range: "24",
      rating: 7,
      testValue: 4,
      testAttribute: "P",
      traits: ["Storm (+X)", "Storm (+X)", "Slow"],
      criticalEffects: ["Ignite (X)"],
      notes:
        "This is what happens when you combine the mechanisms of a minigun with the technology of a laser rifle. Remember to wear eye protection when operating it, initiate.",
    },
    upgrades: [
      {
        name: "Charging Barrels",
        cost: 4,
        ratingNew: 8,
        traits: ["Aim (+X)", "Slow"],
        criticalEffects: ["Ignite (X)"],
      },
    ],
  },
  {
    name: "Missile Launcher",
    base: {
      weaponType: "Heavy Weapon",
      range: "26",
      rating: 8,
      testValue: 5,
      testAttribute: "S",
      traits: ['Area (X")', 'Area (X")', 'Area (X")', "Slow"],
      criticalEffects: ["Maim"],
      notes:
        "Bring one of these with ya if ya really wanna scare the bastard you're fighting. You'll either blow them to pieces or distract them so much that everyone else can jump them. Win-win.",
    },
    upgrades: [
      {
        name: "Quad Barrel",
        cost: 5,
        ratingNew: 9,
        traits: ['Area (X")', "Slow", "One & Done"],
        criticalEffects: ["Maim", "Suppress (X)"],
      },
    ],
  },
  {
    name: "Laser Pistol",
    base: {
      weaponType: "Pistol",
      range: "10",
      rating: 4,
      testValue: 3,
      testAttribute: "A",
      traits: ["CQB (Close-Quarters-Battle)"],
      criticalEffects: ["Ignite (X)", "Ignite (X)"],
      notes:
        "The laser pistol is Brotherhood standard issue: our workhorse sidearm, reliable and accurate – able to set a super mutant ablaze at 30 paces.",
    },
    upgrades: [
      {
        name: "High-Energy Barrel",
        cost: 2,
        rangeNew: "14",
        ratingNew: 7,
      },
      {
        name: "Recalibrated Emitter",
        cost: 4,
        traits: ["CQB (Close-Quarters-Battle)", "Fast"],
        ratingNew: 11,
      },
    ],
  },
  {
    name: "Pipe Pistol",
    base: {
      weaponType: "Pistol",
      range: "8",
      rating: 3,
      testValue: 4,
      testAttribute: "A",
      traits: ["CQB (Close-Quarters-Battle)"],
      notes:
        "A tube on top of a handle. Cheap to maintain and you can upgrade it to suit yer mood – as long as yer mood is splatting a guy's brains across a wall.",
    },
    upgrades: [
      {
        name: "Long Barrel",
        cost: 2,
        rangeNew: "12",
        ratingNew: 6,
      },
      {
        name: "Improved Grip",
        cost: 2,
        traits: ["CQB (Close-Quarters-Battle)", "Aim (+X)"],
        ratingNew: 6,
      },
      {
        name: "Suppressor",
        cost: 2,
        criticalEffects: ["Suppress (X)"],
        ratingNew: 6,
      },
    ],
  },
  {
    name: "Plasma Pistol",
    base: {
      weaponType: "Pistol",
      range: "12",
      rating: 6,
      testValue: 4,
      testAttribute: "A",
      traits: ["CQB (Close-Quarters-Battle)", "Fast"],
      criticalEffects: ["Meltdown"],
      notes:
        "It's funny when this gun turns a human into a slime and all. But then we don't get to smash them, eat them, or cut them. I like it when I get to do those things to puny humans.",
    },
    upgrades: [
      {
        name: "Incendiary Chamber",
        cost: 5,
        criticalEffects: ["Ignite (X)", "Ignite (X)", "Meltdown"],
        ratingNew: 16,
      },
      {
        name: "Extended Barrel",
        cost: 3,
        rangeNew: "16",
        ratingNew: 14,
      },
      {
        name: "Boosted Emitter",
        cost: 4,
        testValueNew: 5,
        ratingNew: 14,
      },
    ],
  },
  {
    name: "Automatic Pipe Rifle",
    base: {
      weaponType: "Rifle",
      range: "16",
      rating: 4,
      testValue: 3,
      testAttribute: "P",
      traits: ["Aim (+X)", "Storm (+X)"],
      criticalEffects: ["Suppress (X)", "Suppress (X)"],
      notes:
        "Just yer humble pipe rifle but it fires bullets quicker. Imagine what you could do if yer gun shot quicker. Go home early. Take some chems. Shoot the poor bastard next to the one you just shot. Possibilities are endless.",
    },
    upgrades: [
      {
        name: "Long Barrel",
        cost: 2,
        rangeNew: "20",
        ratingNew: 5,
      },
      {
        name: "Calibrated Receiver",
        cost: 4,
        testValueNew: 4,
        ratingNew: 8,
      },
    ],
  },
  {
    name: "Double-Barreled Shotgun",
    base: {
      weaponType: "Rifle",
      range: "12",
      rating: 5,
      testValue: 3,
      testAttribute: "P",
      traits: ["Storm (+X)", "Storm (+X)"],
      criticalEffects: ["Maim"],
      notes:
        "If you're looking for a reliable sidearm on the range, well, you can't do much better than a double-barrel. Twice the buck for no extra work, keeps raiders away as well as it does radroaches.",
    },
    upgrades: [
      {
        name: "Heavy Barrel",
        cost: 4,
        testValueNew: 4,
        ratingNew: 8,
      },
      {
        name: "Choke",
        cost: 6,
        ratingNew: 8,
        traits: ["Storm (+X)", "Storm (+X)", "Storm (+X)"],
      },
    ],
  },
  {
    name: "Hunting Rifle",
    base: {
      weaponType: "Rifle",
      range: "22",
      rating: 4,
      testValue: 3,
      testAttribute: "P",
      criticalEffects: ["Pierce"],
      notes:
        "The rifle on the mantelpiece was a family heirloom. My Grandpappy used it to secure our stake in the lands back home. It don't collect dust no more. Instead, it collects kills as it journeys with me through this blasted hellhole.",
    },
    upgrades: [
      {
        name: "Improved Sights",
        cost: 2,
        ratingNew: 6,
        traits: ["Aim (+X)"],
      },
      {
        name: "Calibrated Receiver",
        cost: 4,
        ratingNew: 8,
        testValueNew: 4,
      },
      {
        name: "Marksman's Stock",
        cost: 3,
        ratingNew: 8,
        traits: ["Aim (+X)", "Aim (+X)"],
      },
    ],
  },
  {
    name: "Combat Rifle",
    base: {
      weaponType: "Rifle",
      range: "24",
      rating: 6,
      testValue: 4,
      testAttribute: "P",
      traits: ["Fast"],
      criticalEffects: ["Maim"],
      notes:
        "A real workhorse of a weapon. Use it to tear up targets who get too close or disable foes from range. Recommended among aspirants and initiates.",
    },
    upgrades: [
      {
        name: "Long Barrel",
        cost: 3,
        ratingNew: 9,
        rangeNew: "30",
      },
      {
        name: "Calibrated Receiver",
        cost: 3,
        ratingNew: 10,
        testValueNew: 5,
      },
      {
        name: "Bayonet",
        cost: 2,
        ratingNew: 6,
        traits: ["Bladed", "Fast"],
      },
    ],
  },
  {
    name: "Pipe Rifle",
    base: {
      weaponType: "Rifle",
      range: "20",
      rating: 3,
      testValue: 3,
      testAttribute: "P",
      traits: ["Aim (+X)"],
      criticalEffects: ["Suppress (X)"],
      notes:
        "Good to see the spirit of American industry's still going strong, ain't it? You can make these at home from any old junk you have lying around. Just be careful – use the wrong trash and it might be you the gun takes out instead!",
    },
    upgrades: [
      {
        name: "Long Barrel",
        cost: 3,
        ratingNew: 6,
        rangeNew: "24",
      },
      {
        name: "Calibrated Receiver",
        cost: 3,
        ratingNew: 6,
        testValueNew: 4,
      },
    ],
  },
  {
    name: "Pipe Bolt-Action Rifle",
    base: {
      weaponType: "Rifle",
      range: "20",
      rating: 4,
      testValue: 3,
      testAttribute: "P",
      traits: ["Aim (+X)"],
      criticalEffects: ["Pierce"],
      notes:
        "The best thing in homemade firearms since the original pipe rifle. This one is just like the models you've come to rely on but with that extra bit of accuracy—you'd be a fool not to buy it!",
    },
    upgrades: [
      {
        name: "Calibrated Receiver",
        cost: 4,
        ratingNew: 8,
        testValueNew: 4,
      },
      {
        name: "Marksman's Stock",
        cost: 3,
        ratingNew: 6,
        traits: ["Aim (+X)", "Aim (+X)"],
      },
    ],
  },
  {
    name: "Precision Pipe Rifle",
    base: {
      weaponType: "Rifle",
      range: "20",
      rating: 5,
      testValue: 3,
      testAttribute: "P",
      traits: ["Aim (+X)", "Aim (+X)"],
      criticalEffects: ["Pierce"],
      notes:
        "Instead of bigger pipe, we attach a longer pipe. Now, the bullet goes longer and straighter — good for sharp-eyed Super Mutants to keep humans hiding, so other brothers get closer, to cut them up!",
    },
    upgrades: [
      {
        name: "Long Barrel",
        cost: 3,
        ratingNew: 6,
        rangeNew: "24",
      },
      {
        name: "Marksman's Stock",
        cost: 3,
        ratingNew: 6,
        traits: ["Aim (+X)", "Aim (+X)", "Aim (+X)"],
      },
    ],
  },
  {
    name: "Recon Hunting Rifle",
    base: {
      weaponType: "Rifle",
      range: "24",
      rating: 5,
      testValue: 4,
      testAttribute: "P",
      traits: ["Aim (+X)"],
      criticalEffects: ["Pierce"],
      notes:
        "A weapon we typically hand out to Brotherhood initiates, the recon hunting rifle is far removed from the complex equipment carried by our more storied brethren. It can still stop a Raider in their tracks before they know what's hit them, though.",
    },
    upgrades: [
      {
        name: "Long Barrel",
        cost: 2,
        ratingNew: 6,
        rangeNew: "28",
      },
      {
        name: "Calibrated Receiver",
        cost: 4,
        ratingNew: 8,
        testValueNew: 5,
      },
      {
        name: "Marksman's Stock",
        cost: 3,
        ratingNew: 8,
        traits: ["Aim (+X)", "Aim (+X)"],
      },
    ],
  },
  {
    name: "Sawn-Off Shotgun",
    base: {
      weaponType: "Rifle",
      range: "8",
      rating: 5,
      testValue: 4,
      testAttribute: "P",
      traits: ["CQB (Close-Quarters-Battle)", "Storm (+X)", "Storm (+X)"],
      criticalEffects: ["Maim"],
      notes:
        "Nothin' quite as satisfyin' as pluggin' a couple of shells in a shotgun and unloadin' into the belly of someone who's called you out. Ahh, that brings back memories.",
    },
    upgrades: [
      {
        name: "Long Barrel",
        cost: 3,
        ratingNew: 6,
        rangeNew: "10",
      },
      {
        name: "Calibrated Receiver",
        cost: 4,
        ratingNew: 8,
        testValueNew: 5,
        traits: ["CQB (Close-Quarters-Battle)", "Storm (+X)"],
      },
    ],
  },
  {
    name: "Short Hunting Rifle",
    base: {
      weaponType: "Rifle",
      range: "14",
      rating: 4,
      testValue: 3,
      testAttribute: "P",
      criticalEffects: ["Pierce"],
      notes:
        "We can use this gun to go out hunting. Animals or humans all taste the same after you put them down. The bullets in 'em add an extra crunch.",
    },
    upgrades: [
      {
        name: "Calibrated Receiver",
        cost: 4,
        ratingNew: 6,
        testValueNew: 4,
      },
      {
        name: "Lightweight Frame",
        cost: 3,
        ratingNew: 8,
        traits: ["Fast"],
      },
    ],
  },
  {
    name: "Baseball Grenade",
    base: {
      weaponType: "Grenade",
      range: "8",
      rating: 1,
      testValue: 3,
      testAttribute: "A",
      traits: [
        'Area (X")',
        'Area (X")',
        'Big Swing (X")',
        'Big Swing (X")',
        'Big Swing (X")',
        'Big Swing (X")',
        'Big Swing (X")',
        'Big Swing (X")',
        "CQB (Close-Quarters-Battle)",
      ],
      criticalEffects: ["Suppress (X)"],
      notes:
        "Wasteland ingenuity at its best. Take an old baseball, hollow it out and hock a load of gunpowder in. Give it a good whack and BOOM! Ain't nothing quite like it.",
    },
  },
  {
    name: "Molotov Cocktails",
    base: {
      weaponType: "Grenade",
      range: "8",
      rating: 1,
      testValue: 2,
      testAttribute: "A",
      traits: ['Area (X")', 'Area (X")', "CQB (Close-Quarters-Battle)"],
      criticalEffects: ["Ignite (X)", "Ignite (X)"],
      notes:
        "Many consider this a massive waste of good booze, and I only partially agree. Yeah, it could have been a good drink—but if a quart of brown on fire is going to keep a Raider off my land, well I'll make that trade every day of the week.",
    },
  },
  {
    name: "Minigun",
    base: {
      weaponType: "Heavy Weapon",
      range: "14",
      rating: 8,
      testValue: 4,
      testAttribute: "S",
      traits: ["Slow", "Storm (+X)", "Storm (+X)", "Storm (+X)"],
      criticalEffects: ["Pierce"],
      notes:
        "Nothin' mini about this gun. It's frikkin' massive! What? Whadda you mean it's called a minigun due to the barrel size? Smartass. Stay there a minute and let me try it on you. We'll see if you're so smart in lots of little bits.",
    },
    upgrades: [
      {
        name: "Advanced Receiver",
        cost: 5,
        ratingNew: 12,
        traits: [
          'Selective Fire (Area (1"), Storm (3))',
          "Slow",
          "Storm (+X)",
          "Storm (+X)",
          "Storm (+X)",
        ],
      },
    ],
  },
];
