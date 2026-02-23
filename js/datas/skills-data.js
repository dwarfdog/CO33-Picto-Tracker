// © 2026 Nicolas Markiewicz (DwarfDog) — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
const DATA = {
    "meta": {
        "jeu": "Clair Obscur : Expédition 33",
        "total_pictos": 193,
        "traductions_confirmees": 166,
        "traductions_derivees": 27,
        "sources": [
            "monster-soluce.com/jeux/clair-obscur-expedition-33/guide-solution/pictos",
            "generation-game.com/guide-emplacements-de-tous-les-pictos-de-clair-obscur-expedition-33",
            "clair-obscur.fandom.com/fr/wiki/Pictos",
            "steamcommunity.com/sharedfiles/filedetails/?id=3496217661"
        ],
        "note": "Les traductions marquées 'traduction_confirmee: false' sont dérivées des patterns de nommage officiels du jeu (non vérifiées in-game)."
    },
    "pictos": [
        {
            "id": 1,
            "nom_en": "Dodger",
            "nom_fr": "Insaisissable",
            "traduction_confirmee": true,
            "effet_en": "Gain 1 AP after Perfect Dodge. Once per turn.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "12",
                "chances_crit": "0.03"
            },
            "localisation_en": "Spring Meadows (Meadows Corridor)",
            "localisation_fr": "",
            "obtention_en": "Defeat the Portier after Lune joins the party.",
            "obtention_fr": "",
            "zone": "Spring Meadows"
        },
        {
            "id": 2,
            "nom_en": "Critical Burn",
            "nom_fr": "Brûlures critiques",
            "traduction_confirmee": true,
            "effet_en": "25% increased Critical Chance on Burning Enemies",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "8",
                "chances_crit": "0.06"
            },
            "localisation_en": "Spring Meadows (Meadows Corridor)",
            "localisation_fr": "",
            "obtention_en": "After getting Lanceram, look for a path on the right that leads to a small cave.",
            "obtention_fr": "",
            "zone": "Spring Meadows"
        },
        {
            "id": 3,
            "nom_en": "Augmented Attack",
            "nom_fr": "Attaque améliorée",
            "traduction_confirmee": true,
            "effet_en": "50% increased Base Attack damage",
            "effet_fr": "",
            "statistiques": {
                "defense": "8",
                "vitesse": "10"
            },
            "localisation_en": "Spring Meadows (Meadows Corridor)",
            "localisation_fr": "",
            "obtention_en": "Defeat the Chromatic Lancelier after learning about flying enemies.",
            "obtention_fr": "",
            "zone": "Spring Meadows"
        },
        {
            "id": 4,
            "nom_en": "Burning Shots",
            "nom_fr": "Tirs brûlants",
            "traduction_confirmee": true,
            "effet_en": "20% Chance to burn on free Aim Shot",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "15",
                "chances_crit": "0.25"
            },
            "localisation_en": "Spring Meadows (Abandoned Expeditioner)",
            "localisation_fr": "",
            "obtention_en": "From the campsite, go through the cave path until you're outside, and then head left towards the cliff.",
            "obtention_fr": "",
            "zone": "Spring Meadows"
        },
        {
            "id": 5,
            "nom_en": "Dead Energy II",
            "nom_fr": "Énergie mortelle II",
            "traduction_confirmee": true,
            "effet_en": "+3 AP on killing an enemy",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "4",
                "chances_crit": "0.09"
            },
            "localisation_en": "Spring Meadows (Abandoned Expeditioner)",
            "localisation_fr": "",
            "obtention_en": "From the campsite, go through the cave path. When you're outside, turn right and follow the path.",
            "obtention_fr": "",
            "zone": "Spring Meadows"
        },
        {
            "id": 6,
            "nom_en": "Cleansing Tint",
            "nom_fr": "Teinte purificatrice",
            "traduction_confirmee": true,
            "effet_en": "Healing Tints also remove all Status Effects from the target",
            "effet_fr": "",
            "statistiques": {
                "sante": "778",
                "defense": "319"
            },
            "localisation_en": "Spring Meadows (The Indigo Tree)",
            "localisation_fr": "",
            "obtention_en": "Defeat Eveque, the boss of the area, to get this Pictos.",
            "obtention_fr": "",
            "zone": "Spring Meadows"
        },
        {
            "id": 7,
            "nom_en": "Empowering Attack",
            "nom_fr": "Attaque renforçante",
            "traduction_confirmee": true,
            "effet_en": "Gain Powerful for 1 turn on Base Attack",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "12",
                "chances_crit": "0.03"
            },
            "localisation_en": "Spring Meadows (The Indigo Tree)",
            "localisation_fr": "",
            "obtention_en": "Instead of leaving Spring Meadows after the Eveque fight, turn around and follow the path on the right.",
            "obtention_fr": "",
            "zone": "Spring Meadows"
        },
        {
            "id": 8,
            "nom_en": "SOS Shell",
            "nom_fr": "Danger protecteur",
            "traduction_confirmee": true,
            "effet_en": "Apply Shell when falling below 50% Health",
            "effet_fr": "",
            "statistiques": {
                "defense": "13",
                "vitesse": "14"
            },
            "localisation_en": "Flying Waters (Before Any Flag)",
            "localisation_fr": "",
            "obtention_en": "Immediately upon loading the map, enter the path to the left of the anchor. The Pictos is on the ground at the end of the path.",
            "obtention_fr": "",
            "zone": "Flying Waters"
        },
        {
            "id": 9,
            "nom_en": "Marking Shots",
            "nom_fr": "Tirs marquants",
            "traduction_confirmee": true,
            "effet_en": "20% Chance to apply Mark on Free Aim shot",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "26",
                "chances_crit": "0.02"
            },
            "localisation_en": "Flying Waters (Before Any Flag)",
            "localisation_fr": "",
            "obtention_en": "Follow the path beyond the Paint Cage to reach a fork that is marked with several lanterns on the ground. Head left at the fork and defeat the two enemies at the end of the path. The Pictos is on the ground just past those enemies.",
            "obtention_fr": "",
            "zone": "Flying Waters"
        },
        {
            "id": 10,
            "nom_en": "Exposing Attack",
            "nom_fr": "Attaque fragilisante",
            "traduction_confirmee": true,
            "effet_en": "Base Attack applies Defenceless for 1 turn",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "20",
                "chances_crit": "0.04"
            },
            "localisation_en": "Flying Waters (Noco's Hut)",
            "localisation_fr": "",
            "obtention_en": "After Gustave and Lune extract Maelle from the Manor, speak with the Gestral Merchant who appears in front of the hut. Fight and defeat that merchant to add this Pictos to their wares.",
            "obtention_fr": "",
            "zone": "Flying Waters"
        },
        {
            "id": 11,
            "nom_en": "Staggering Attack",
            "nom_fr": "Attaque Fracturante",
            "traduction_confirmee": true,
            "effet_en": "50% Increased Break Damage on Base Attack",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "21",
                "chances_crit": "0.04"
            },
            "localisation_en": "Flying Waters (Coral Cave)",
            "localisation_fr": "",
            "obtention_en": "Pass the Flag and immediately look to the right to find this Pictos on the ground.",
            "obtention_fr": "",
            "zone": "Flying Waters"
        },
        {
            "id": 12,
            "nom_en": "Rewarding Mark",
            "nom_fr": "Marque gratifiante",
            "traduction_confirmee": true,
            "effet_en": "+2 AP on dealing damage to a Marked target. Once per turn.",
            "effet_fr": "",
            "statistiques": {
                "defense": "20",
                "vitesse": "7"
            },
            "localisation_en": "Flying Waters (Coral Cave)",
            "localisation_fr": "",
            "obtention_en": "(1) Players will encounter a mass from which several lanterns extend just past the Expedition Flag. After passing that mass, players should look for a short ramp on their left, which leads to an alcove with this Pictos. (2) Buy from Merchant for 53,880 Chroma from Sacred River.",
            "obtention_fr": "",
            "zone": "Flying Waters"
        },
        {
            "id": 13,
            "nom_en": "Augmented Counter I",
            "nom_fr": "Contre amélioré I",
            "traduction_confirmee": true,
            "effet_en": "25% increased Counterattack damage",
            "effet_fr": "",
            "statistiques": {
                "sante": "563",
                "chances_crit": "0.07"
            },
            "localisation_en": "Flying Waters (Coral Cave)",
            "localisation_fr": "",
            "obtention_en": "Players can now climb the aforementioned two-handhold wall and follow the path forward. Before reaching the buildings on this path, players should enter a small corridor on their right and fight the Bourgeon that they encounter to obtain the Pictos, weapon, and quest item.",
            "obtention_fr": "",
            "zone": "Flying Waters"
        },
        {
            "id": 14,
            "nom_en": "Energising Break",
            "nom_fr": "Fracture énergisante",
            "traduction_confirmee": true,
            "effet_en": "+3 AP on Breaking a target.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "14",
                "chances_crit": "0.07"
            },
            "localisation_en": "Flying Waters (Lumieran Street)",
            "localisation_fr": "",
            "obtention_en": "This Pictos is on the ground just past the Chromatic Troubadour.",
            "obtention_fr": "",
            "zone": "Flying Waters"
        },
        {
            "id": 15,
            "nom_en": "Versatile",
            "nom_fr": "Polyvalence",
            "traduction_confirmee": true,
            "effet_en": "After a Free Aim hit, base attack damage is increased by 50% for 1 turn.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "21",
                "chances_crit": "0.04"
            },
            "localisation_en": "Flying Waters (Lumieran Street)",
            "localisation_fr": "",
            "obtention_en": "Players who head straight forward from the Flag will find that there are two buildings emerging from the ground. Players should get on top of those buildings and then use their grappling hooks to reach the buildings on the side of the area. Players should then go right and grab this Pictos from the ground.",
            "obtention_fr": "",
            "zone": "Flying Waters"
        },
        {
            "id": 16,
            "nom_en": "Energising Jump",
            "nom_fr": "Énergie de saut",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on Jump Counterattack",
            "effet_fr": "",
            "statistiques": {
                "sante": "44",
                "vitesse": "29"
            },
            "localisation_en": "Ancient Sanctuary (Entrance)",
            "localisation_fr": "",
            "obtention_en": "Find this Pictos on the ground to the left of the illuminated spot that was used to trap the local Petank.",
            "obtention_fr": "",
            "zone": "Ancient Sanctuary"
        },
        {
            "id": 17,
            "nom_en": "Burning Mark",
            "nom_fr": "Marque brûlante",
            "traduction_confirmee": true,
            "effet_en": "Apply Burn on hitting a Marked enemy",
            "effet_fr": "",
            "statistiques": {
                "sante": "44",
                "defense": "32"
            },
            "localisation_en": "Ancient Sanctuary (Entrance)",
            "localisation_fr": "",
            "obtention_en": "Players should follow the stream in the area with the Petank to reach a wall with handholds, which they can shimmy across. This action will lead players to a small area with this Pictos.",
            "obtention_fr": "",
            "zone": "Ancient Sanctuary"
        },
        {
            "id": 18,
            "nom_en": "Energising Start II",
            "nom_fr": "Énergie — Départ II",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on battle start",
            "effet_fr": "",
            "statistiques": {
                "sante": "175"
            },
            "localisation_en": "Ancient Sanctuary (Sanctuary Maze)",
            "localisation_fr": "",
            "obtention_en": "After passing the Sanctuary Maze Expedition Flag, players should go right at the fork and look for a small alcove on their right. There is a low gap in this alcove through which players can crawl, and they should go right when they emerge. Players should then make their way to the far end of the area and use the two handholds on the left to climb a small wall. There is a path at the top that leads directly to this Pictos.",
            "obtention_fr": "",
            "zone": "Ancient Sanctuary"
        },
        {
            "id": 19,
            "nom_en": "Attack Lifesteal",
            "nom_fr": "Vol de vie",
            "traduction_confirmee": true,
            "effet_en": "Recover 15% Health on base attack",
            "effet_fr": "",
            "statistiques": {
                "sante": "88",
                "chances_crit": "0.08"
            },
            "localisation_en": "Ancient Sanctuary (Sanctuary Maze)",
            "localisation_fr": "",
            "obtention_en": "Players should now descend the handholds that they used to reach the Energising Start II Pictos and enter the tunnel that is ahead. This tunnel leads to a Catapult Sakapatate, who is guarding this Pictos in a small alcove.",
            "obtention_fr": "",
            "zone": "Ancient Sanctuary"
        },
        {
            "id": 20,
            "nom_en": "Piercing Shot",
            "nom_fr": "Tirs perforants",
            "traduction_confirmee": false,
            "effet_en": "25% increased Free Aim damage. Free Aim shots ignore Shields",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Ancient Sanctuary (Sanctuary Maze)",
            "localisation_fr": "",
            "obtention_en": "In the area just before the area with the blue statues, use paint break to destroy a root. Head forward to the Gestral Totem expedition flag. Jump into the water and follow it into an alcove with the Pictos.",
            "obtention_fr": "",
            "zone": "Ancient Sanctuary"
        },
        {
            "id": 21,
            "nom_en": "Breaker",
            "nom_fr": "Fracture améliorée",
            "traduction_confirmee": true,
            "effet_en": "25% Increased Break Damage",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "26",
                "chances_crit": "0.09"
            },
            "localisation_en": "Ancient Sanctuary (Giant Bell Alley)",
            "localisation_fr": "",
            "obtention_en": "Players will encounter the Ultimate Sakapatate, the map's final boss, not long after passing the Giant Bell Alley Expedition Flag, and they will receive this Pictos upon besting the foe in combat.",
            "obtention_fr": "",
            "zone": "Ancient Sanctuary"
        },
        {
            "id": 22,
            "nom_en": "Stun Boost",
            "nom_fr": "Étourdissement opportun",
            "traduction_confirmee": true,
            "effet_en": "30% increased damage on Stunned targets",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "35",
                "chances_crit": "0.02"
            },
            "localisation_en": "Ancient Sanctuary (Giant Bell Alley)",
            "localisation_fr": "",
            "obtention_en": "There is a tunnel through which players can crawl next to the Energy Tint Shard, and the path that is beyond that tunnel leads directly to this Pictos.",
            "obtention_fr": "",
            "zone": "Ancient Sanctuary"
        },
        {
            "id": 23,
            "nom_en": "Critical Moment",
            "nom_fr": "Instant critique",
            "traduction_confirmee": true,
            "effet_en": "50% increased Critical Chance if Health is below 30%.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "26",
                "chances_crit": "0.09"
            },
            "localisation_en": "Gestral Village",
            "localisation_fr": "",
            "obtention_en": "Buy from the Bazaar",
            "obtention_fr": "",
            "zone": "Gestral Village"
        },
        {
            "id": 24,
            "nom_en": "Roulette",
            "nom_fr": "Roulette",
            "traduction_confirmee": true,
            "effet_en": "Every hit has a 50% chance to deal either 50% or 200% of its damage",
            "effet_fr": "",
            "statistiques": {
                "defense": "34",
                "chances_crit": "0.09"
            },
            "localisation_en": "Gestral Village",
            "localisation_fr": "",
            "obtention_en": "Speak to the Gambler",
            "obtention_fr": "",
            "zone": "Gestral Village"
        },
        {
            "id": 25,
            "nom_en": "Healing Mark",
            "nom_fr": "Marque curative",
            "traduction_confirmee": true,
            "effet_en": "Recover 25% Health on hitting a Marked enemy. Once per turn.",
            "effet_fr": "",
            "statistiques": {
                "defense": "65"
            },
            "localisation_en": "Gestral Village",
            "localisation_fr": "",
            "obtention_en": "In the Bazaar, enter the alcove to trigger a duel with a black market Gestral. Defeat to unlock in shop.",
            "obtention_fr": "",
            "zone": "Gestral Village"
        },
        {
            "id": 26,
            "nom_en": "Last Stand Critical",
            "nom_fr": "Dernier rempart critique",
            "traduction_confirmee": true,
            "effet_en": "100% Critical Chance while fighting alone.",
            "effet_fr": "",
            "statistiques": {
                "sante": "168",
                "defense": "50"
            },
            "localisation_en": "Hidden Gestral Arena",
            "localisation_fr": "",
            "obtention_en": "Beat Matthieu",
            "obtention_fr": "",
            "zone": "Hidden Gestral Arena"
        },
        {
            "id": 27,
            "nom_en": "Accelerating Last Stand",
            "nom_fr": "Dernier rempart accélérant",
            "traduction_confirmee": true,
            "effet_en": "Gain Rush if fighting alone.",
            "effet_fr": "",
            "statistiques": {
                "sante": "168",
                "vitesse": "34"
            },
            "localisation_en": "Hidden Gestral Arena",
            "localisation_fr": "",
            "obtention_en": "Beat Bertrand",
            "obtention_fr": "",
            "zone": "Hidden Gestral Arena"
        },
        {
            "id": 28,
            "nom_en": "Protecting Last Stand",
            "nom_fr": "Dernier rempart protecteur",
            "traduction_confirmee": true,
            "effet_en": "Gain Shell if fighting alone.",
            "effet_fr": "",
            "statistiques": {
                "sante": "168",
                "defense": "50"
            },
            "localisation_en": "Hidden Gestral Arena",
            "localisation_fr": "",
            "obtention_en": "Beat Dominique",
            "obtention_fr": "",
            "zone": "Hidden Gestral Arena"
        },
        {
            "id": 29,
            "nom_en": "Solo Fighter",
            "nom_fr": "Loup solitaire",
            "traduction_confirmee": true,
            "effet_en": "Deal 50% more damage if fighting alone.",
            "effet_fr": "",
            "statistiques": {
                "sante": "168",
                "defense": "50"
            },
            "localisation_en": "Hidden Gestral Arena",
            "localisation_fr": "",
            "obtention_en": "Beat Julien",
            "obtention_fr": "",
            "zone": "Hidden Gestral Arena"
        },
        {
            "id": 30,
            "nom_en": "Empowering Last Stand",
            "nom_fr": "Dernier rempart renforçant",
            "traduction_confirmee": true,
            "effet_en": "Gain Powerful if fighting alone.",
            "effet_fr": "",
            "statistiques": {
                "sante": "168",
                "chances_crit": "0.1"
            },
            "localisation_en": "Hidden Gestral Arena",
            "localisation_fr": "",
            "obtention_en": "Beat all opponents",
            "obtention_fr": "",
            "zone": "Hidden Gestral Arena"
        },
        {
            "id": 31,
            "nom_en": "Augmented Aim",
            "nom_fr": "Visée améliorée",
            "traduction_confirmee": true,
            "effet_en": "50% increased Free Aim damage.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "39",
                "chances_crit": "0.05"
            },
            "localisation_en": "Gestral Village",
            "localisation_fr": "",
            "obtention_en": "Speak with Merchant in Bazaar after completing Forgotten Battlefield.",
            "obtention_fr": "",
            "zone": "Gestral Village"
        },
        {
            "id": 32,
            "nom_en": "Augmented First Strike",
            "nom_fr": "Initiative améliorée",
            "traduction_confirmee": true,
            "effet_en": "50% Increased damage on the first hit. Once per battle",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "51",
                "chances_crit": "0.05"
            },
            "localisation_en": "Esquie's Nest",
            "localisation_fr": "",
            "obtention_en": "Defeat Francois.",
            "obtention_fr": "",
            "zone": "Esquie's Nest"
        },
        {
            "id": 33,
            "nom_en": "Energising Start III",
            "nom_fr": "Énergie — Départ III",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on battle start",
            "effet_fr": "",
            "statistiques": {
                "sante": "320"
            },
            "localisation_en": "Esquie's Nest",
            "localisation_fr": "",
            "obtention_en": "Leave the cave after Esquie makes the path for you, and the Pictos will be outside in the front entrance.",
            "obtention_fr": "",
            "zone": "Esquie's Nest"
        },
        {
            "id": 34,
            "nom_en": "Defensive Mode",
            "nom_fr": "Mode défensif",
            "traduction_confirmee": false,
            "effet_en": "On receiving damage, consume 1 AP to take 30% less damage, if possible.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Stone Wave Cliffs",
            "localisation_fr": "",
            "obtention_en": "Enter through the portal on the beach. Look forward and to the left.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 35,
            "nom_en": "Confident",
            "nom_fr": "Assurance",
            "traduction_confirmee": true,
            "effet_en": "Take 50% less damage, but can't be healed",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "75",
                "chances_crit": "0.13"
            },
            "localisation_en": "Stone Wave Cliffs (Rest Point)",
            "localisation_fr": "",
            "obtention_en": "Defeat the big rock monster 'Hexga' on the path after the entrance rest point.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 36,
            "nom_en": "Breaking Counter",
            "nom_fr": "Contre Fracturant",
            "traduction_confirmee": true,
            "effet_en": "50% Increased Break damage on Counterattack",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "43",
                "chances_crit": "0.1"
            },
            "localisation_en": "Stone Wave Cliffs (Rest Point)",
            "localisation_fr": "",
            "obtention_en": "Look to the left of the rock monster to find an old ship. Inside the ship is the Pictos",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 37,
            "nom_en": "Energising Pain",
            "nom_fr": "Énergie douloureuse",
            "traduction_confirmee": true,
            "effet_en": "No longer gain AP on Parry. +1 AP on getting hit",
            "effet_fr": "",
            "statistiques": {
                "sante": "1166",
                "defense": "160"
            },
            "localisation_en": "Stone Wave Cliffs (Rest Point)",
            "localisation_fr": "",
            "obtention_en": "After beating the rock monster, Hexga, continue forward to find some more monsters in the next area. Beat the enemy on the left side of the area to find the Pictos.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 38,
            "nom_en": "First Strike",
            "nom_fr": "Initiative",
            "traduction_confirmee": true,
            "effet_en": "Play first",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "41",
                "chances_crit": "0.1"
            },
            "localisation_en": "Stone Wave Cliffs (Paintress Shrine)",
            "localisation_fr": "",
            "obtention_en": "Before using the grappling point that leads to the Paintress Shrine rest area, hop on the platforms to the right to find a side area with an enemy and a secret Pictos.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 39,
            "nom_en": "SOS Power",
            "nom_fr": "Danger surpuissant",
            "traduction_confirmee": true,
            "effet_en": "Apply Powerful when falling below 50% health",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "43",
                "chances_crit": "0.1"
            },
            "localisation_en": "Stone Wave Cliffs (Paintress Shrine)",
            "localisation_fr": "",
            "obtention_en": "When a monster jumps out at you, hug the right wall to find a slope leading to the Pictos.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 40,
            "nom_en": "Breaking Shots",
            "nom_fr": "Tirs Fracturants",
            "traduction_confirmee": true,
            "effet_en": "50% increased Break damage with Free Aim shots",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "43",
                "chances_crit": "0.1"
            },
            "localisation_en": "Stone Wave Cliffs (Tide Caverns)",
            "localisation_fr": "",
            "obtention_en": "When you're looking for the three rock crystals in a cave, you need to jump across some tall platforms with careful timing.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 41,
            "nom_en": "Perilous Parry",
            "nom_fr": "Parade périlleuse",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on Parry, but damage received is doubled.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "280",
                "chances_crit": "0.23"
            },
            "localisation_en": "Stone Wave Cliffs (Tide Caverns)",
            "localisation_fr": "",
            "obtention_en": "Defeat the enemy on the bottom level of the caverns.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 42,
            "nom_en": "Auto Shell",
            "nom_fr": "Carapace immédiate",
            "traduction_confirmee": true,
            "effet_en": "Apply Shell for 3 turns on battle start.",
            "effet_fr": "",
            "statistiques": {
                "sante": "411"
            },
            "localisation_en": "Stone Wave Cliffs (Tide Caverns)",
            "localisation_fr": "",
            "obtention_en": "Give three crystals to Hexga.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 43,
            "nom_en": "Healing Tint Energy",
            "nom_fr": "Teinte curative énergisante",
            "traduction_confirmee": true,
            "effet_en": "Healing Tints also give 1 AP",
            "effet_fr": "",
            "statistiques": {
                "sante": "216",
                "defense": "71"
            },
            "localisation_en": "Stone Wave Cliffs - Flooded Buildings",
            "localisation_fr": "",
            "obtention_en": "Grapple back across, return to the bottom of the building, and use the grapple point to the left to cross the gap. Continue along the path to encounter two Nevrons. The Healing Tint Energy Pictos is on the ground just past those enemies.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs - Flooded Buildings"
        },
        {
            "id": 44,
            "nom_en": "Enfeebling Mark",
            "nom_fr": "Marque affaiblissante",
            "traduction_confirmee": true,
            "effet_en": "Marked Targets deal 30% less damage",
            "effet_fr": "",
            "statistiques": {
                "defense": "102",
                "vitesse": "21"
            },
            "localisation_en": "Stone Wave Cliffs - Flooded Buildings",
            "localisation_fr": "",
            "obtention_en": "Descend through the structure and follow the path to enter yet another building. Climb to the top and look left upon exiting the building to find a grapple point that can be used to reach an area with the Enfeebling Mark Pictos.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs - Flooded Buildings"
        },
        {
            "id": 45,
            "nom_en": "At Death's Door",
            "nom_fr": "Au seuil de la mort",
            "traduction_confirmee": true,
            "effet_en": "Deal 50% more damage if health is below 10%",
            "effet_fr": "",
            "statistiques": {
                "defense": "96",
                "chances_crit": "0.11"
            },
            "localisation_en": "Stone Wave Cliffs (Basalt Waves)",
            "localisation_fr": "",
            "obtention_en": "Defeat the Lampmaster boss",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 46,
            "nom_en": "Dead Energy I",
            "nom_fr": "Énergie mortelle I",
            "traduction_confirmee": true,
            "effet_en": "+3 AP on killing an enemy",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "?",
                "chances_crit": "?"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Found on the Continent, in front of the entrance to Dark Shores, about 100 feet away is a cluster of crates you can break apart, containing the Picto.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 47,
            "nom_en": "Healing Parry",
            "nom_fr": "Parade curative",
            "traduction_confirmee": true,
            "effet_en": "Recover 3% health on parry",
            "effet_fr": "",
            "statistiques": {
                "sante": "127",
                "defense": "34"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "There is a Bourgeon between Esquie's Nest and Stone Wave Cliffs. There is a Lost Gestral just past it, and this Pictos is in a camp nearby.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 48,
            "nom_en": "Energising Start I",
            "nom_fr": "Énergie — Départ I",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on battle start.",
            "effet_fr": "",
            "statistiques": {
                "sante": "320"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Beach north of Gestral Village",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 49,
            "nom_en": "Protecting Heal",
            "nom_fr": "Soins protecteurs",
            "traduction_confirmee": false,
            "effet_en": "Healing an ally also applies Shell for a turn",
            "effet_fr": "",
            "statistiques": {
                "sante": "395",
                "vitesse": "78"
            },
            "localisation_en": "Esoteric Ruins/Continent (Near Old Lumiere Entrance)",
            "localisation_fr": "",
            "obtention_en": "Find the Wood Boards and give it to the spirit by the entrance",
            "obtention_fr": "",
            "zone": "Esoteric Ruins/Continent"
        },
        {
            "id": 50,
            "nom_en": "Accelerating Heal",
            "nom_fr": "Soins accélérants",
            "traduction_confirmee": false,
            "effet_en": "Healing an ally also applies Rush for 1 turn",
            "effet_fr": "",
            "statistiques": {
                "sante": "329",
                "vitesse": "65"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "On the first Painting Workshop isle. Walk to the opposite side past the monsters.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 51,
            "nom_en": "Shared Care",
            "nom_fr": "Soins partagés",
            "traduction_confirmee": true,
            "effet_en": "When healing an ally, also Heal self for 50% of that value",
            "effet_fr": "",
            "statistiques": {
                "sante": "206",
                "defense": "68"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "On the island with the portal into White Tree.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 52,
            "nom_en": "Energising Heal",
            "nom_fr": "Soins énergisants",
            "traduction_confirmee": true,
            "effet_en": "On Healing an ally, also give 2 AP",
            "effet_fr": "",
            "statistiques": {
                "sante": "206",
                "vitesse": "41"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Small beach north of the island with the portal into White Tree.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 53,
            "nom_en": "Empowering Dodge",
            "nom_fr": "Esquive renforçante",
            "traduction_confirmee": true,
            "effet_en": "5% increased damage for each consecutive successful dodge. Can stack up to 10 times.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "162",
                "chances_crit": "0.17"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Walk a little north of Endless Night Sanctuary to find this on the ground.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 54,
            "nom_en": "Fueling Break",
            "nom_fr": "Fracture embrasante",
            "traduction_confirmee": true,
            "effet_en": "Breaking a target doubles its burn amount",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "507",
                "chances_crit": "0.31"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "(1) Near the entrance to The Carousel. (2) Complete Stage 7, Trial 3 of the Endless Tower",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 55,
            "nom_en": "Charging Tint",
            "nom_fr": "Teinte chargeante",
            "traduction_confirmee": true,
            "effet_en": "+5% of a Gradient Charge on using an item.",
            "effet_fr": "",
            "statistiques": {
                "sante": "329",
                "defense": "122"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "In a camp next to the merchant on small beach southeast of Gestral Beach (NW). Surrounded by enemies.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 56,
            "nom_en": "Burning Death",
            "nom_fr": "Mort brûlante",
            "traduction_confirmee": true,
            "effet_en": "Apply 3 Burn to all enemies on Death",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "65",
                "chances_crit": "0.12"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Beat Bourgeon that is near Merchant NW of Gestral Beach (NW).",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 57,
            "nom_en": "Breaking Burn",
            "nom_fr": "Brûlure fracturante",
            "traduction_confirmee": true,
            "effet_en": "25% increased Break damage on Burning enemies",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "243",
                "chances_crit": "0.09"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Past Burning Death Bourgeon.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 58,
            "nom_en": "Cheater",
            "nom_fr": "Tricheur",
            "traduction_confirmee": true,
            "effet_en": "Always play twice in a row",
            "effet_fr": "",
            "statistiques": {
                "sante": "1198",
                "vitesse": "400"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Defeat Sprong. It's a huge enemy walking in the water next to Blades' Graveyard/Crimson Forest.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 59,
            "nom_en": "Longer Burn",
            "nom_fr": "Brûlures prolongées",
            "traduction_confirmee": true,
            "effet_en": "Burn duration is increased by 2",
            "effet_fr": "",
            "statistiques": {
                "sante": "2392",
                "defense": "1292"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Beat the Chromatic Aberration on floating island between Dark Shores and The Fountain.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 60,
            "nom_en": "Breaking Death",
            "nom_fr": "Mort fracturante",
            "traduction_confirmee": false,
            "effet_en": "Fully charge enemy's Break Bar on death",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "586",
                "chances_crit": "0.33"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Defeat the Eveque east of Stone Wave Cliffs Cave.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 61,
            "nom_en": "Breaking Slow",
            "nom_fr": "Ralentissement sur fracture",
            "traduction_confirmee": false,
            "effet_en": "25% increased Break damage against Slowed enemies.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "162",
                "chances_crit": "0.17"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Paint Break a root southeast of Abbest Cave in the area filled with statues.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 62,
            "nom_en": "Energising Shell",
            "nom_fr": "Énergie — Carapace",
            "traduction_confirmee": true,
            "effet_en": "Give 2 AP on applying Shell.",
            "effet_fr": "",
            "statistiques": {
                "defense": "319",
                "vitesse": "154"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "The Picto can be found in a paint spike in the area of the Chromatic Petank to the east of The Meadows on the world map (accessible via Esquie flight).",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 63,
            "nom_en": "Energising Gradient",
            "nom_fr": "Énergie — Gradient",
            "traduction_confirmee": false,
            "effet_en": "+1 AP per Gradient Charge consumed",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Beat the Frost Eveque northeast of Forgotten Battlefield exit.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 64,
            "nom_en": "Warming Up",
            "nom_fr": "Échauffement",
            "traduction_confirmee": true,
            "effet_en": "5% increased damage per turn. Can stack up to 5 times.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Beat the Grosse Tete in front of Coastal Cave (northeast of Forgotten Battlefield)",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 65,
            "nom_en": "Energy Master",
            "nom_fr": "Énergie maîtrisée",
            "traduction_confirmee": true,
            "effet_en": "Every AP gain is increased by 1.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Defeat the Serpenphare (flying dragon boss).",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 66,
            "nom_en": "Longer Rush",
            "nom_fr": "Rapidité prolongée",
            "traduction_confirmee": false,
            "effet_en": "On applying Rush, its duration is increased by 2.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Look east of Monoco's Station/south of Frozen Hearts to find an ice monster near a broken camp.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 67,
            "nom_en": "Anti-Stun",
            "nom_fr": "Anti-étourdissement",
            "traduction_confirmee": true,
            "effet_en": "Immune to Stun.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "Beat the Chromatic Petank in the field southeast of Forgotten Battlefield/East of Gestral Village.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 68,
            "nom_en": "Longer Shell",
            "nom_fr": "Carapace prolongée",
            "traduction_confirmee": true,
            "effet_en": "On applying Shell, its duration is increased by 2",
            "effet_fr": "",
            "statistiques": {
                "sante": "1333",
                "defense": "647"
            },
            "localisation_en": "Forgotten Battlefield (Main Gate)",
            "localisation_fr": "",
            "obtention_en": "Defeat the first wild enemy after entering the gates of Forgotten Battlefield.",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 69,
            "nom_en": "Sweet Kill",
            "nom_fr": "Élimination revigorante",
            "traduction_confirmee": true,
            "effet_en": "Recover 50% health on killing an enemy",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "54",
                "chances_crit": "0.11"
            },
            "localisation_en": "Forgotten Battlefield (Main Gate)",
            "localisation_fr": "",
            "obtention_en": "After entering the main area, enter a side area to the left that leads you to some items, including the Pictos.",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 70,
            "nom_en": "Energising Start IV",
            "nom_fr": "Énergie — Départ IV",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on battle start.",
            "effet_fr": "",
            "statistiques": {
                "sante": "513"
            },
            "localisation_en": "Forgotten Battlefield (Main Gate)",
            "localisation_fr": "",
            "obtention_en": "Right side of the big open area. In the trenches.",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 71,
            "nom_en": "Energising Death",
            "nom_fr": "Mort énergisante",
            "traduction_confirmee": true,
            "effet_en": "On death, +4 AP to allies",
            "effet_fr": "",
            "statistiques": {
                "defense": "96",
                "vitesse": "54"
            },
            "localisation_en": "Forgotten Battlefield (Fort Ruins)",
            "localisation_fr": "",
            "obtention_en": "From the Flag, use the footholds, follow the path until you see a staircase to the right. Defeat the enemy patrol and look to the left to find a hidden item.",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 72,
            "nom_en": "Energising Parry",
            "nom_fr": "Énergie — Parade",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on successful parry",
            "effet_fr": "",
            "statistiques": {
                "sante": "626"
            },
            "localisation_en": "Forgotten Battlefield (Battlefield)",
            "localisation_fr": "",
            "obtention_en": "When you see the Faded Woman near the flag, turn to the right and go through the hall, and then take the second right to find a special enemy called Chromatic Luster. It'll drop the Pictos.",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 73,
            "nom_en": "Empowering Tint",
            "nom_fr": "Teinte renforçante",
            "traduction_confirmee": true,
            "effet_en": "Healing Tints also apply Powerful",
            "effet_fr": "",
            "statistiques": {
                "sante": "2705",
                "vitesse": "546"
            },
            "localisation_en": "Forgotten Battlefield (Battlefield)",
            "localisation_fr": "",
            "obtention_en": "(1) Same area as above. Turn right at the woman, take the first right to find a magic rope. (2) Complete Stage 8, Trial 3 of Endless Tower",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 74,
            "nom_en": "Inverted Affinity",
            "nom_fr": "Affinité Inversée",
            "traduction_confirmee": true,
            "effet_en": "Apply Inverted on self for three turns at battle start. 50 % increased damage while inverted.",
            "effet_fr": "",
            "statistiques": {
                "sante": "270",
                "chances_crit": "0.11"
            },
            "localisation_en": "Forgotten Battlefield (Ancient Bridge)",
            "localisation_fr": "",
            "obtention_en": "When you pick up the Expedition 57 journal, look nearby to find stairs leading to a rope. You'll find the trader Kasumi.",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 75,
            "nom_en": "Combo Attack I",
            "nom_fr": "Attaque combo I",
            "traduction_confirmee": true,
            "effet_en": "Base attack has one extra hit",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "93",
                "chances_crit": "0.06"
            },
            "localisation_en": "Forgotten Battlefield (Ancient Bridge)",
            "localisation_fr": "",
            "obtention_en": "Fight the boss after passing this flag.",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 76,
            "nom_en": "Revive Tint Energy",
            "nom_fr": "Teinte de vie énergisante",
            "traduction_confirmee": true,
            "effet_en": "Revive Tints also give 3 AP",
            "effet_fr": "",
            "statistiques": {
                "sante": "257",
                "defense": "92"
            },
            "localisation_en": "Forgotten Battlefield (Ancient Bridge)",
            "localisation_fr": "",
            "obtention_en": "From the flag, cross the bridge using the grapple, turn right to enter a new woodsy area to find the Pictos in the middle.",
            "obtention_fr": "",
            "zone": "Forgotten Battlefield"
        },
        {
            "id": 77,
            "nom_en": "Healing Counter",
            "nom_fr": "Contre curatif",
            "traduction_confirmee": true,
            "effet_en": "Recover 25% Health on Counterattack",
            "effet_fr": "",
            "statistiques": {
                "sante": "751"
            },
            "localisation_en": "Old Lumiere (Entrance)",
            "localisation_fr": "",
            "obtention_en": "Buy from Merchant near Entrance rest point - 20,400 Chroma.",
            "obtention_fr": "",
            "zone": "Old Lumiere"
        },
        {
            "id": 78,
            "nom_en": "Longer Powerful",
            "nom_fr": "Surpuissance prolongée",
            "traduction_confirmee": true,
            "effet_en": "On applying Powerful, its duration is increased by 2",
            "effet_fr": "",
            "statistiques": {
                "sante": "376",
                "chances_crit": "0.13"
            },
            "localisation_en": "Old Lumiere (Entrance)",
            "localisation_fr": "",
            "obtention_en": "Buy from Merchant near Entrance rest point - 20,400 Chroma.",
            "obtention_fr": "",
            "zone": "Old Lumiere"
        },
        {
            "id": 79,
            "nom_en": "Time Tint",
            "nom_fr": "Teinte temporelle",
            "traduction_confirmee": true,
            "effet_en": "Energy Tints also apply Rush",
            "effet_fr": "",
            "statistiques": {
                "sante": "1897",
                "defense": "949"
            },
            "localisation_en": "Old Lumiere (Right Street)",
            "localisation_fr": "",
            "obtention_en": "Pass the grappling point, you'll eventually have to jump over a gap before reaching the next area, but if you drop down a ledge to the right, you'll find this Pictos. If you've reached the faded man, you've gone too far.",
            "obtention_fr": "",
            "zone": "Old Lumiere"
        },
        {
            "id": 80,
            "nom_en": "Auto Rush",
            "nom_fr": "Rapidité immédiate",
            "traduction_confirmee": true,
            "effet_en": "Apply Rush for three turns on battle start",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "112",
                "chances_crit": "0.07"
            },
            "localisation_en": "Old Lumiere (Right Street)",
            "localisation_fr": "",
            "obtention_en": "When Maelle and Verso split, you're gonna use a grapple point to cross a broken bridge. Turn left after walking forward a bit to find three enemies huddled around the Pictos.",
            "obtention_fr": "",
            "zone": "Old Lumiere"
        },
        {
            "id": 81,
            "nom_en": "Healing Death",
            "nom_fr": "Mort curative",
            "traduction_confirmee": true,
            "effet_en": "On death, the rest of the Expedition recovers all Health.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Old Lumiere (Manor Gardens)",
            "localisation_fr": "",
            "obtention_en": "After Renoir is defeated, follow the path beyond the Paint Cage to access a section that is filled with grapple points, threads, and handholds. After traversing that section, descend the slope and defeat the Nevron at the bottom to obtain the Perilous Parry Pictos. The Healing Death Pictos is on the ground next to that Nevron.",
            "obtention_fr": "",
            "zone": "Old Lumiere"
        },
        {
            "id": 82,
            "nom_en": "Revive Paradox",
            "nom_fr": "Renaissance paradoxale",
            "traduction_confirmee": true,
            "effet_en": "Play immediately when revived",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Old Lumiere (Train Station Ruins)",
            "localisation_fr": "",
            "obtention_en": "After beating Renoir, return to the Entrance expedition flag and follow the critical path to reach a ledge where two gold threads can be activated. Head right at the ledge to reach the Train Station Ruins expedition flag, and continue forward, descending a gold thread when necessary, to reach the Chromatic Danseuse.",
            "obtention_fr": "",
            "zone": "Old Lumiere"
        },
        {
            "id": 83,
            "nom_en": "Healing Share",
            "nom_fr": "Partage curatif",
            "traduction_confirmee": true,
            "effet_en": "Revive 15% of all Heals affecting other characters",
            "effet_fr": "",
            "statistiques": {
                "sante": "467",
                "chances_crit": "0.14"
            },
            "localisation_en": "Visages (Plazza)",
            "localisation_fr": "",
            "obtention_en": "Buy from Merchant nearby for 19,200 Chroma.",
            "obtention_fr": "",
            "zone": "Visages"
        },
        {
            "id": 84,
            "nom_en": "Confident Fighter",
            "nom_fr": "Hardiesse",
            "traduction_confirmee": true,
            "effet_en": "30% increased damage, but can't be healed",
            "effet_fr": "",
            "statistiques": {
                "sante": "222",
                "chances_crit": "0.2"
            },
            "localisation_en": "Visages (Joy Vale)",
            "localisation_fr": "",
            "obtention_en": "From the flag, pass the first group of dancing monsters, keep heading right until you see a big moving face with closed eyes. Head up the hill to the right to find an enemy near the pictos.",
            "obtention_fr": "",
            "zone": "Visages"
        },
        {
            "id": 85,
            "nom_en": "Double Burn",
            "nom_fr": "Double brûlure",
            "traduction_confirmee": true,
            "effet_en": "On applying a Burn stack, apply a second one",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "132",
                "chances_crit": "0.07"
            },
            "localisation_en": "Visages (Anger Vale)",
            "localisation_fr": "",
            "obtention_en": "From the Flag, head to the right towards the big face. Look to the right to find a little cave. Walk inside and then towards the left to find some enemies standing near the Pictos.",
            "obtention_fr": "",
            "zone": "Visages"
        },
        {
            "id": 86,
            "nom_en": "Powered Attack",
            "nom_fr": "Attaque accrue",
            "traduction_confirmee": true,
            "effet_en": "On every damage dealt, try to consume 1 AP. If successful, increase damage by 20%",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "132",
                "chances_crit": "0.07"
            },
            "localisation_en": "Visages (Anger Vale)",
            "localisation_fr": "",
            "obtention_en": "From the Flag, head right towards the big face, but head left into a corridor that leads to a magic rope and a Pictos.",
            "obtention_fr": "",
            "zone": "Visages"
        },
        {
            "id": 87,
            "nom_en": "Augmented Counter II",
            "nom_fr": "Contre amélioré II",
            "traduction_confirmee": true,
            "effet_en": "50% increased counterattack damage",
            "effet_fr": "",
            "statistiques": {
                "defense": "208",
                "chances_crit": "0.15"
            },
            "localisation_en": "Visages (Anger Vale)",
            "localisation_fr": "",
            "obtention_en": "From the flag, head straight and then right to find a hidden area leading to Chromatic Ramasseur. Defeat it to get the Pictos.",
            "obtention_fr": "",
            "zone": "Visages"
        },
        {
            "id": 88,
            "nom_en": "Glass Canon",
            "nom_fr": "Canon de verre",
            "traduction_confirmee": true,
            "effet_en": "Deal 25% more damage, but take 25% more damage",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "175"
            },
            "localisation_en": "Visages (Anger Vale)",
            "localisation_fr": "",
            "obtention_en": "Right next to where the Chromatic Ramasseur is (same as above)",
            "obtention_fr": "",
            "zone": "Visages"
        },
        {
            "id": 89,
            "nom_en": "Immaculate",
            "nom_fr": "Immaculé",
            "traduction_confirmee": true,
            "effet_en": "30% increased damage until a hit is received",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "103",
                "chances_crit": "0.15"
            },
            "localisation_en": "Visages (Plazza)",
            "localisation_fr": "",
            "obtention_en": "Beat the Axon boss (Visages / Mask Keeper)",
            "obtention_fr": "",
            "zone": "Visages"
        },
        {
            "id": 90,
            "nom_en": "Shield Affinity",
            "nom_fr": "Boucliers Affinés",
            "traduction_confirmee": true,
            "effet_en": "30% increased damage while having Shields, but receiving any damage always removes all shields.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "118",
                "chances_crit": "0.16"
            },
            "localisation_en": "Sirene (Dancing Classes)",
            "localisation_fr": "",
            "obtention_en": "Go forward on the main path up the stairs, and then go inside the room to the left to find stairs. Go down to find a magic rope. Use the grapple to reach a paint cage. Destroy its parts to get the Pictos.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 91,
            "nom_en": "Effective Heal",
            "nom_fr": "Soins efficaces",
            "traduction_confirmee": true,
            "effet_en": "Double all Heals received",
            "effet_fr": "",
            "statistiques": {
                "sante": "284",
                "defense": "341"
            },
            "localisation_en": "Sirene (Dancing Classes)",
            "localisation_fr": "",
            "obtention_en": "Go forward on the main path up the stairs, and then go inside the room to the left to find stairs. Go down to find a magic rope. Use the grapple to reach a paint cage. Use the magic platform to reach a new area and then turn right to find the Pictos behind the Chromatic Greatsword Cultist.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 92,
            "nom_en": "Greater Shell",
            "nom_fr": "Carapace améliorée",
            "traduction_confirmee": true,
            "effet_en": "+10% to Shell damage reduction",
            "effet_fr": "",
            "statistiques": {
                "sante": "599",
                "defense": "240"
            },
            "localisation_en": "Sirene (Dancing Classes)",
            "localisation_fr": "",
            "obtention_en": "When you get off the moving platform to land in the area where the Chromatic enemy is, go to the opposite end to find this Pictos and some handholds.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 93,
            "nom_en": "Powerful on Shell",
            "nom_fr": "Carapace surpuissante",
            "traduction_confirmee": true,
            "effet_en": "Apply Powerful on applying Shell",
            "effet_fr": "",
            "statistiques": {
                "defense": "874",
                "chances_crit": "0.25"
            },
            "localisation_en": "Sirene (Dancing Classes)",
            "localisation_fr": "",
            "obtention_en": "When you get to the room with the large statue in the middle, head to the right to enter a multi tiered room that looks like the inside of an organ. Head to the bottom of this area to find the Benisseur. Defeat it to get the pictos.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 94,
            "nom_en": "Auto Regen",
            "nom_fr": "Régénération immédiate",
            "traduction_confirmee": true,
            "effet_en": "Apply Regen for three more turns on battle start",
            "effet_fr": "",
            "statistiques": {
                "defense": "479"
            },
            "localisation_en": "Sirene (Dancing Classes)",
            "localisation_fr": "",
            "obtention_en": "When you get to the room with the large statue in the middle, head to the right to enter a multi-tiered room that looks like the inside of an organ. Head to the bottom of this area.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 95,
            "nom_en": "Protecting Death",
            "nom_fr": "Mort protectrice",
            "traduction_confirmee": true,
            "effet_en": "On Death, allies gain Shell",
            "effet_fr": "",
            "statistiques": {
                "sante": "599",
                "vitesse": "118"
            },
            "localisation_en": "Sirene (Dancing Classes)",
            "localisation_fr": "",
            "obtention_en": "Go past the door to the Manor, and then take a right before the next grapple point.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 96,
            "nom_en": "Anti-Charm",
            "nom_fr": "Anti-charme",
            "traduction_confirmee": true,
            "effet_en": "Immune to Charm",
            "effet_fr": "",
            "statistiques": {
                "sante": "599",
                "defense": "240"
            },
            "localisation_en": "Sirene (Sewing Atelier)",
            "localisation_fr": "",
            "obtention_en": "Defeat the Tisseur (large optional weaver boss)",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 97,
            "nom_en": "Healing Fire",
            "nom_fr": "Feu curatif",
            "traduction_confirmee": true,
            "effet_en": "Recover 25% of health when attacking a Burning foe. Once a turn",
            "effet_fr": "",
            "statistiques": {
                "defense": "240",
                "vitesse": "118"
            },
            "localisation_en": "Sirene (Crumbling Path)",
            "localisation_fr": "",
            "obtention_en": "Head to the right from the flag to find a magic rope. Head down, use the grapple point, and follow the trail to find this Pictos.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 98,
            "nom_en": "Double Mark",
            "nom_fr": "Double marque",
            "traduction_confirmee": true,
            "effet_en": "Mark requires 1 more hit to be removed",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "236"
            },
            "localisation_en": "Sirene (Crumbling Path)",
            "localisation_fr": "",
            "obtention_en": "From the flag, head to the area on the left to find handholds. Use them to reach a magic rope. Follow the path to find a Merchant at the end of it.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 99,
            "nom_en": "Energising Attack II",
            "nom_fr": "Énergie — Attaque II",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on base attack",
            "effet_fr": "",
            "statistiques": {
                "defense": "120",
                "vitesse": "177"
            },
            "localisation_en": "Sirene (Crumbling Path)",
            "localisation_fr": "",
            "obtention_en": "Same as above",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 100,
            "nom_en": "Greater Powerful",
            "nom_fr": "Surpuissance améliorée",
            "traduction_confirmee": true,
            "effet_en": "+15% to Powerful damage increase",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "59",
                "chances_crit": "0.23"
            },
            "localisation_en": "Sirene (Crumbling Path)",
            "localisation_fr": "",
            "obtention_en": "Same as above",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 101,
            "nom_en": "Energising Turn",
            "nom_fr": "Énergie — Tour",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on turn start",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "270"
            },
            "localisation_en": "Sirene",
            "localisation_fr": "",
            "obtention_en": "Beat the boss, Sirene, at the end of the map.",
            "obtention_fr": "",
            "zone": "Sirene"
        },
        {
            "id": 102,
            "nom_en": "Energising Cleanse",
            "nom_fr": "Purification énergisante",
            "traduction_confirmee": false,
            "effet_en": "Dispel the first negative Status Effect received and gain 2 AP.",
            "effet_fr": "",
            "statistiques": {
                "sante": "1166",
                "defense": "160"
            },
            "localisation_en": "Inside the Monolith (Tainted Meadows)",
            "localisation_fr": "",
            "obtention_en": "Head into the watery area after the second black and white scene with the Paintress. Look on the path to the left to find the merchant. Fight him to buy the Pictos for 40,800 Chroma.",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 103,
            "nom_en": "Stay Marked",
            "nom_fr": "Marque après marque",
            "traduction_confirmee": true,
            "effet_en": "50% chance to apply Mark when attacking a Marked enemy",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "201",
                "chances_crit": "0.12"
            },
            "localisation_en": "Inside the Monolith (Tainted Waters)",
            "localisation_fr": "",
            "obtention_en": "Go straight from the flag to find a little hidden path leading to the Chromatic Bourgeon. The Pictos is right behind it.",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 104,
            "nom_en": "Weakness Gain",
            "nom_fr": "Énergie — Faiblesse",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on hitting an enemy's weakness once per turn",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "162",
                "chances_crit": "0.17"
            },
            "localisation_en": "Inside the Monolith (Tainted Cliffs)",
            "localisation_fr": "",
            "obtention_en": "When you go past the windmill and head on the main path, you'll end up in an area with a Hexga. Look on the right side to find this Pictos.",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 105,
            "nom_en": "Random Defense",
            "nom_fr": "Défense aléatoire",
            "traduction_confirmee": true,
            "effet_en": "Damage taken is randomly multiplied by a value between 50% and 200%",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Inside the Monolith (Tainted Cliffs)",
            "localisation_fr": "",
            "obtention_en": "Turn around, leave the cave, and head to the right to find a secluded area with a Paint Cage. Need Paint Break to reveal one of its locks.",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 106,
            "nom_en": "Empowering Parry",
            "nom_fr": "Parade renforçante",
            "traduction_confirmee": false,
            "effet_en": "Each successful parry increases damage by 5% until end of the following turn. Taking damage removes this buff.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "162",
                "chances_crit": "0.17"
            },
            "localisation_en": "Inside the Monolith (Tainted Hearts)",
            "localisation_fr": "",
            "obtention_en": "When the path splits for the first time, head left past a huge rock monster to find a grapple point leading to a Paint Cage.",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 107,
            "nom_en": "Greater Defenceless",
            "nom_fr": "Vulnérabilité améliorée",
            "traduction_confirmee": true,
            "effet_en": "+15% to defenceless damage amplification",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "293",
                "chances_crit": "0.23"
            },
            "localisation_en": "Inside the Monolith (Tainted Hearts)",
            "localisation_fr": "",
            "obtention_en": "When the path splits for the first time, turn left and then look to the right to find some handholds on the wall leading to a Merchant.",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 108,
            "nom_en": "Enfeebling Attack",
            "nom_fr": "Attaque affaiblissante",
            "traduction_confirmee": true,
            "effet_en": "Base Attack applies powerless for 1 turn",
            "effet_fr": "",
            "statistiques": {
                "sante": "1789",
                "defense": "3542"
            },
            "localisation_en": "Inside the Monolith (Tainted Hearts)",
            "localisation_fr": "",
            "obtention_en": "Cross the bridge beyond the Tainted Hearts expedition flag and immediately go left to enter an area with Gargant, a large Nevron. There are handholds on the wall to the right of that foe, and they lead to a merchant that sells a variety of items. The Enfeebling Attack Pictos is on the ground just past the merchant, next to a wrecked train.",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 109,
            "nom_en": "Breaking Attack",
            "nom_fr": "Fracture sur Attaque",
            "traduction_confirmee": true,
            "effet_en": "Base attack can Break",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "154",
                "chances_crit": "0.17"
            },
            "localisation_en": "Inside the Monolith (Tainted Lumiere)",
            "localisation_fr": "",
            "obtention_en": "When you pass the big tree into a new area, immediately turn left and grapple onto the platform on the other side to fight some enemies.",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 110,
            "nom_en": "Second Chance",
            "nom_fr": "Seconde chance",
            "traduction_confirmee": true,
            "effet_en": "Revive with 100% Health. Once per battle",
            "effet_fr": "",
            "statistiques": {
                "sante": "1107",
                "chances_crit": "0.08"
            },
            "localisation_en": "Inside the Monolith (Tower Peak)",
            "localisation_fr": "",
            "obtention_en": "Defeat Renoir",
            "obtention_fr": "",
            "zone": "Inside the Monolith"
        },
        {
            "id": 111,
            "nom_en": "Combo Attack II",
            "nom_fr": "Attaque combo II",
            "traduction_confirmee": true,
            "effet_en": "Base attack has 1 extra hit",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "1089",
                "chances_crit": "0.19"
            },
            "localisation_en": "Monolith Peak (Entrance)",
            "localisation_fr": "",
            "obtention_en": "After beating the Paintress, return to the arena in which you fought her to encounter Chromatic Clair Obscur. Beat the Nevron to obtain the Combo Attack II Pictos.",
            "obtention_fr": "",
            "zone": "Monolith Peak"
        },
        {
            "id": 112,
            "nom_en": "Painted Power",
            "nom_fr": "Puissance Surpeinte",
            "traduction_confirmee": true,
            "effet_en": "Damage can exceed 9,999",
            "effet_fr": "",
            "statistiques": {
                "sante": "1844"
            },
            "localisation_en": "Monolith Peak",
            "localisation_fr": "",
            "obtention_en": "Defeat the Paintress.",
            "obtention_fr": "",
            "zone": "Monolith Peak"
        },
        {
            "id": 113,
            "nom_en": "Shortcut",
            "nom_fr": "Raccourci",
            "traduction_confirmee": true,
            "effet_en": "Immediately play when falling below 30% health. Once per battle",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "182",
                "chances_crit": "0.18"
            },
            "localisation_en": "Lumiere (Harbour)",
            "localisation_fr": "",
            "obtention_en": "Fight the Abberation near the first big horse statue.",
            "obtention_fr": "",
            "zone": "Lumiere"
        },
        {
            "id": 114,
            "nom_en": "Energising Powerful",
            "nom_fr": "Énergie — Surpuissance",
            "traduction_confirmee": true,
            "effet_en": "Give 2 AP on applying Powerful",
            "effet_fr": "",
            "statistiques": {
                "defense": "373",
                "vitesse": "173"
            },
            "localisation_en": "Lumiere (Harbour)",
            "localisation_fr": "",
            "obtention_en": "When you need to use the magic rope at the end of the initial path, ignore the grapple point to the left and instead head on the path to the right to lead you to the Pictos.",
            "obtention_fr": "",
            "zone": "Lumiere"
        },
        {
            "id": 115,
            "nom_en": "Charging Stun",
            "nom_fr": "Charges sur étourdissement",
            "traduction_confirmee": true,
            "effet_en": "+5% of a Gradient Charge on hitting a Stunned enemy",
            "effet_fr": "",
            "statistiques": {
                "sante": "922",
                "vitesse": "182"
            },
            "localisation_en": "Lumiere (Shattered Alley)",
            "localisation_fr": "",
            "obtention_en": "From the flag, turn around to see the Pictos near the large tree.",
            "obtention_fr": "",
            "zone": "Lumiere"
        },
        {
            "id": 116,
            "nom_en": "Augmented Counter III",
            "nom_fr": "Contre amélioré III",
            "traduction_confirmee": true,
            "effet_en": "75% Increased Counterattack Damage",
            "effet_fr": "",
            "statistiques": {
                "defense": "432",
                "chances_crit": "0.19"
            },
            "localisation_en": "Lumiere (Shattered Alley)",
            "localisation_fr": "",
            "obtention_en": "Continue the path until you spot a large creature with a light on its head. Defeat the Chromatic Echassier.",
            "obtention_fr": "",
            "zone": "Lumiere"
        },
        {
            "id": 117,
            "nom_en": "Healing Stun",
            "nom_fr": "Étourdissement curatif",
            "traduction_confirmee": true,
            "effet_en": "Recover 5% Health on hitting a Stunned target",
            "effet_fr": "",
            "statistiques": {
                "sante": "876",
                "vitesse": "173"
            },
            "localisation_en": "Lumiere (Opera House)",
            "localisation_fr": "",
            "obtention_en": "Follow the path, use two grapple points, head on the left path, and keep an eye on the right wall to find this one. (You can find a dupe on the opposite side.)",
            "obtention_fr": "",
            "zone": "Lumiere"
        },
        {
            "id": 118,
            "nom_en": "Full Strength",
            "nom_fr": "Pleine puissance",
            "traduction_confirmee": true,
            "effet_en": "25% increased damage on full Health",
            "effet_fr": "",
            "statistiques": {
                "sante": "876",
                "defense": "373"
            },
            "localisation_en": "Lumiere (Lumiere's Gardens)",
            "localisation_fr": "",
            "obtention_en": "Buy from Merchant after fighting him. Turn around and the merchant will be to the left. 53,200 Chroma.",
            "obtention_fr": "",
            "zone": "Lumiere"
        },
        {
            "id": 119,
            "nom_en": "Gradient Fighter",
            "nom_fr": "Gradient combattant",
            "traduction_confirmee": true,
            "effet_en": "25% Increased damage with Gradient Attacks",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "182",
                "chances_crit": "0.18"
            },
            "localisation_en": "Lumiere (Lumiere's Gardens)",
            "localisation_fr": "",
            "obtention_en": "When you start walking the main path after the flag, turn on the second set of staircases to the left to find a Pictos by some enemies.",
            "obtention_fr": "",
            "zone": "Lumiere"
        },
        {
            "id": 120,
            "nom_en": "Faster Than Strong",
            "nom_fr": "Plus vif que fort",
            "traduction_confirmee": true,
            "effet_en": "Always play twice in a row, but deal 50% less damage",
            "effet_fr": "",
            "statistiques": {
                "sante": "876",
                "defense": "373"
            },
            "localisation_en": "Lumiere (Lumiere's Gardens)",
            "localisation_fr": "",
            "obtention_en": "Fight Creation at the end of the garden path to get this.",
            "obtention_fr": "",
            "zone": "Lumiere"
        },
        {
            "id": 121,
            "nom_en": "Draining Cleanse",
            "nom_fr": "Purification drainante",
            "traduction_confirmee": false,
            "effet_en": "Consume 1 AP to prevent Status Effects application, if possible.",
            "effet_fr": "",
            "statistiques": {
                "sante": "2000",
                "defense": "324"
            },
            "localisation_en": "The Reacher (Entrance)",
            "localisation_fr": "",
            "obtention_en": "After you grapple and use a magic rope, look right to see the Pictos behind enemies.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 122,
            "nom_en": "Sniper",
            "nom_fr": "Tireur d'élite",
            "traduction_confirmee": true,
            "effet_en": "First Free Aim shot each turn deals 200% increased damage and can Break",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "420",
                "chances_crit": "0.12"
            },
            "localisation_en": "The Reacher (Mountain)",
            "localisation_fr": "",
            "obtention_en": "Fight the first group of monsters after the flag.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 123,
            "nom_en": "Charging Counter",
            "nom_fr": "Charges sur contre",
            "traduction_confirmee": true,
            "effet_en": "+10% of a Gradient Charge on Counterattack.",
            "effet_fr": "",
            "statistiques": {
                "sante": "1333",
                "defense": "647"
            },
            "localisation_en": "The Reacher (Mountain)",
            "localisation_fr": "",
            "obtention_en": "Before the second hot air balloon ride, look to the left to find handholds leading to a side area. You'll find the Pictos at the end of it.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 124,
            "nom_en": "Charging Attack",
            "nom_fr": "Charges sur attaque",
            "traduction_confirmee": true,
            "effet_en": "+15% of a Gradient Charge on Base Attack",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "266",
                "chances_crit": "0.22"
            },
            "localisation_en": "The Reacher (Mountain)",
            "localisation_fr": "",
            "obtention_en": "Before the second hot air balloon ride, look to the left to find handholds leading to a side area. You'll find the Pictos at the end of it.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 125,
            "nom_en": "Protecting Tint",
            "nom_fr": "Teinte protectrice",
            "traduction_confirmee": true,
            "effet_en": "Healing Tints also apply Shell",
            "effet_fr": "",
            "statistiques": {
                "sante": "1403",
                "defense": "681"
            },
            "localisation_en": "The Reacher (Foggy Area)",
            "localisation_fr": "",
            "obtention_en": "Cross the second wooden bridge and then turn right.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 126,
            "nom_en": "Anti-Blight",
            "nom_fr": "Anti-corruption",
            "traduction_confirmee": true,
            "effet_en": "Immune to Blight",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "The Reacher (Foggy Area)",
            "localisation_fr": "",
            "obtention_en": "Head to the path on the left to find a hot air balloon ride, and speak to the nearby Merchant. 67,350 Chroma.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 127,
            "nom_en": "Exposing Break",
            "nom_fr": "Fracture fragilisante",
            "traduction_confirmee": false,
            "effet_en": "Apply Defenceless on Break",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "The Reacher (Foggy Area)",
            "localisation_fr": "",
            "obtention_en": "Head to the path on the left to find a hot air balloon ride, and speak to the nearby Merchant. 53,880 Chroma.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 128,
            "nom_en": "Charging Weakness",
            "nom_fr": "Charges sur faiblesse",
            "traduction_confirmee": true,
            "effet_en": "15% of a Gradient Charge on hitting a Weakness. Once per turn.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "280",
                "chances_crit": "0.23"
            },
            "localisation_en": "The Reacher (Foggy Area)",
            "localisation_fr": "",
            "obtention_en": "Head to the path on the left to find a hot air balloon ride, and speak to the nearby Merchant. 53,880 Chroma.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 129,
            "nom_en": "Tainted",
            "nom_fr": "Altéré",
            "traduction_confirmee": true,
            "effet_en": "15% Increased damage for each Status Effect on self",
            "effet_fr": "",
            "statistiques": {
                "defense": "1022",
                "chances_crit": "0.12"
            },
            "localisation_en": "The Reacher (Foggy Area)",
            "localisation_fr": "",
            "obtention_en": "Head to the path on the left to find a hot air balloon ride, and speak to the nearby Merchant. 49,391 Chroma.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 130,
            "nom_en": "Healing Boon",
            "nom_fr": "Buff curatif",
            "traduction_confirmee": true,
            "effet_en": "Heal 15% HP on applying a buff",
            "effet_fr": "",
            "statistiques": {
                "defense": "647",
                "vitesse": "266"
            },
            "localisation_en": "The Reacher (Foggy Area)",
            "localisation_fr": "",
            "obtention_en": "Head to the path on the left to find a hot air balloon ride. Use the grappling points afterwards to find a magic rope leading down to a Pictos.",
            "obtention_fr": "",
            "zone": "The Reacher"
        },
        {
            "id": 131,
            "nom_en": "Energising Rush",
            "nom_fr": "Énergie — Rapidité",
            "traduction_confirmee": true,
            "effet_en": "Give 2 AP on applying Rush",
            "effet_fr": "",
            "statistiques": {
                "defense": "801",
                "vitesse": "321"
            },
            "localisation_en": "Endless Tower",
            "localisation_fr": "",
            "obtention_en": "Complete Stage 2, Trial 3",
            "obtention_fr": "",
            "zone": "Endless Tower"
        },
        {
            "id": 132,
            "nom_en": "Charging Critical",
            "nom_fr": "Charges sur critiques",
            "traduction_confirmee": true,
            "effet_en": "+20% Gradient Charge on Critical Hit. Once per turn",
            "effet_fr": "",
            "statistiques": {
                "defense": "1048",
                "chances_crit": "0.27"
            },
            "localisation_en": "Endless Tower",
            "localisation_fr": "",
            "obtention_en": "Complete Stage 5, Trial 3",
            "obtention_fr": "",
            "zone": "Endless Tower"
        },
        {
            "id": 133,
            "nom_en": "Critical Weakness",
            "nom_fr": "Critiques sur faiblesse",
            "traduction_confirmee": true,
            "effet_en": "25% increased Critical Chance on Weakness",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "670",
                "chances_crit": "0.14"
            },
            "localisation_en": "Endless Tower",
            "localisation_fr": "",
            "obtention_en": "Complete Stage 6, Trial 3",
            "obtention_fr": "",
            "zone": "Endless Tower"
        },
        {
            "id": 134,
            "nom_en": "Rush on Powerful",
            "nom_fr": "Rapidité sur surpuissance",
            "traduction_confirmee": false,
            "effet_en": "Apply Rush on applying Powerful",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "557",
                "chances_crit": "0.32"
            },
            "localisation_en": "Endless Tower",
            "localisation_fr": "",
            "obtention_en": "Complete Stage 9, Trial 3",
            "obtention_fr": "",
            "zone": "Endless Tower"
        },
        {
            "id": 135,
            "nom_en": "Greater Powerless",
            "nom_fr": "Affaiblissement amélioré",
            "traduction_confirmee": true,
            "effet_en": "+15% to Powerless damage reduction",
            "effet_fr": "",
            "statistiques": {
                "defense": "1727",
                "vitesse": "597"
            },
            "localisation_en": "Endless Tower",
            "localisation_fr": "",
            "obtention_en": "Complete Stage 10, Trial 3",
            "obtention_fr": "",
            "zone": "Endless Tower"
        },
        {
            "id": 136,
            "nom_en": "Anti-Burn",
            "nom_fr": "Anti-brûlure",
            "traduction_confirmee": true,
            "effet_en": "Immune to Burn",
            "effet_fr": "",
            "statistiques": {
                "sante": "2757",
                "defense": "1572"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "From the Flag, run towards the faded boy to find a staircase past him. Take it down to find a magic rope that leads to an elevator. Fight the giant rock monster (Gargant)",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 137,
            "nom_en": "Charging Alteration",
            "nom_fr": "Charges sur altération",
            "traduction_confirmee": true,
            "effet_en": "+10% of a Gradient Charge on applying a buff. Once per turn.",
            "effet_fr": "",
            "statistiques": {
                "defense": "1501",
                "vitesse": "546"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "From the Flag, run towards the faded boy to find a staircase past him. Take it down to find a magic rope that leads to an elevator and a new area. Run down the stairs, head towards the left to find a grapple point. Follow the path and grapple to reach the Pictos.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 138,
            "nom_en": "Energetic Healer",
            "nom_fr": "Soignant énergétique",
            "traduction_confirmee": false,
            "effet_en": "+2 AP when healing an ally",
            "effet_fr": "",
            "statistiques": {
                "defense": "1426",
                "vitesse": "519"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "To the right of the flag, take the stairs and rope down to the lower section of Flying Manor. The Picto can be found on the ledge to the left after riding the rope up to the Lampmaster boss area.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 139,
            "nom_en": "Painter",
            "nom_fr": "Peintre",
            "traduction_confirmee": true,
            "effet_en": "Convert all Physical damage to Void damage",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "519",
                "chances_crit": "0.31"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "From the Flag, go towards the grapple point leading to the big locked door. Look to the right to find a large picture frame you can walk on. It'll lead to a new area. You'll find this Picto on one of the upper walkways.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 140,
            "nom_en": "Powerful Revive",
            "nom_fr": "Renaissance surpuissante",
            "traduction_confirmee": true,
            "effet_en": "Apply Powerful for three turns when Revived",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "546",
                "chances_crit": "0.32"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "Beat the Dualliste and then go to the upper area near where you fought him to find a grapple point leading to a Paint Cage containing the Pictos.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 141,
            "nom_en": "Empowering Break",
            "nom_fr": "Fracture renforçante",
            "traduction_confirmee": false,
            "effet_en": "Gain Powerful on Breaking a target",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "546",
                "chances_crit": "0.32"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "Take the elevator right next to the Flag. When you get up, follow the path and hug the left to find a magic rope. Stay on the left and find a grapple that leads to the Pictos behind a monster",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 142,
            "nom_en": "Accelerating Shots",
            "nom_fr": "Tirs Accélérants",
            "traduction_confirmee": true,
            "effet_en": "20% chance to gain Rush on Free Aim shot",
            "effet_fr": "",
            "statistiques": {
                "sante": "4869",
                "defense": "301"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "Take the elevator right next to the Flag. When you get up, follow the path and then once it splits into three, head on the left path to find a merchant.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 143,
            "nom_en": "Gradient Breaker",
            "nom_fr": "Charges sur fracture",
            "traduction_confirmee": true,
            "effet_en": "50% increased Break damage when using Gradient attacks",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "546",
                "chances_crit": "0.32"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "(1) Take the elevator right next to the Flag. When you get up, follow the path and then once it splits into three, head on the left path to find a merchant. (2) You can find the Gradient Break Pictos in a small cave along one of the paths behind the Grandis NPC at Endless Night Sanctuary.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 144,
            "nom_en": "Break Specialist",
            "nom_fr": "Spécialiste en fracture",
            "traduction_confirmee": false,
            "effet_en": "Break damage is increased by 50%, but base damage is reduced by 20%",
            "effet_fr": "",
            "statistiques": {
                "sante": "2705",
                "vitesse": "546"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "Take the elevator right next to the Flag. When you get up, follow the path and then once it splits into three, head on the left path to find a merchant.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 145,
            "nom_en": "Slowing Break",
            "nom_fr": "Fracture ralentissante",
            "traduction_confirmee": false,
            "effet_en": "Apply Slow on Break",
            "effet_fr": "",
            "statistiques": {
                "defense": "1501",
                "vitesse": "546"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "Take the elevator right next to the Flag. When you get up, follow the path and then once it splits into three, head on the left path to find a merchant.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 146,
            "nom_en": "Energising Shots",
            "nom_fr": "Tirs énergisants",
            "traduction_confirmee": true,
            "effet_en": "20% chance to gain 1 AP on Free Aim shot",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "779",
                "chances_crit": "0.16"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "Defeat Goblu as part of the challenge (take the elevator next to the flag). The Pictos will be next to Goblu.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 147,
            "nom_en": "Clea's Life",
            "nom_fr": "Vitalité de Cléa",
            "traduction_confirmee": true,
            "effet_en": "On turn start, if no damage taken since last turn, recover 100% health",
            "effet_fr": "",
            "statistiques": {
                "sante": "5591"
            },
            "localisation_en": "Flying Manor - Central Plaza",
            "localisation_fr": "",
            "obtention_en": "Defeat Clea at the end of Flying Manor.",
            "obtention_fr": "",
            "zone": "Flying Manor - Central Plaza"
        },
        {
            "id": 148,
            "nom_en": "SOS Rush",
            "nom_fr": "Danger accélérant",
            "traduction_confirmee": true,
            "effet_en": "Apply Rush when falling below 50% Health.",
            "effet_fr": "",
            "statistiques": {
                "defense": "288",
                "vitesse": "142"
            },
            "localisation_en": "Falling Leaves - Resinveil Groove",
            "localisation_fr": "",
            "obtention_en": "From Journal 35, turn around and walk along the stone path. Look to the right for the Pictos.",
            "obtention_fr": "",
            "zone": "Falling Leaves - Resinveil Groove"
        },
        {
            "id": 149,
            "nom_en": "Beneficial Contamination",
            "nom_fr": "Contamination bénéfique",
            "traduction_confirmee": true,
            "effet_en": "+2 AP on applying a Status Effect. Once per turn.",
            "effet_fr": "",
            "statistiques": {
                "defense": "274",
                "vitesse": "135"
            },
            "localisation_en": "Falling Leaves - Resinveil Groove",
            "localisation_fr": "",
            "obtention_en": "Left from the flag, grapple across and follow the path to a Merchant.",
            "obtention_fr": "",
            "zone": "Falling Leaves - Resinveil Groove"
        },
        {
            "id": 150,
            "nom_en": "Greater Slow",
            "nom_fr": "Ralentissement amélioré",
            "traduction_confirmee": false,
            "effet_en": "+15% to Slow Speed reduction",
            "effet_fr": "",
            "statistiques": {
                "defense": "647",
                "vitesse": "266"
            },
            "localisation_en": "Sky Island - Entrance",
            "localisation_fr": "",
            "obtention_en": "Find a staircase at the end of this small map.",
            "obtention_fr": "",
            "zone": "Sky Island - Entrance"
        },
        {
            "id": 151,
            "nom_en": "In Medias Res",
            "nom_fr": "Au cœur de l'action",
            "traduction_confirmee": true,
            "effet_en": "+3 Shields on Battle Start, but max health is halved",
            "effet_fr": "",
            "statistiques": {
                "defense": "1310",
                "chances_crit": "0.13"
            },
            "localisation_en": "Dark Shores - Bloodied Beach",
            "localisation_fr": "",
            "obtention_en": "Run straight past the flag to the end of the area to find this surrounded by enemies.",
            "obtention_fr": "",
            "zone": "Dark Shores - Bloodied Beach"
        },
        {
            "id": 152,
            "nom_en": "Energising Revive",
            "nom_fr": "Renaissance énergisante",
            "traduction_confirmee": true,
            "effet_en": "+3 AP to all Allies when revived",
            "effet_fr": "",
            "statistiques": {
                "sante": "270",
                "defense": "96"
            },
            "localisation_en": "Stone Wave Cliffs Cave",
            "localisation_fr": "",
            "obtention_en": "Beat the Chromatic Hexga at the end.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs Cave"
        },
        {
            "id": 153,
            "nom_en": "Exhausting Power",
            "nom_fr": "Pouvoir Épuisant",
            "traduction_confirmee": true,
            "effet_en": "50% increased damage if exhausted",
            "effet_fr": "",
            "statistiques": {
                "sante": "270",
                "defense": "96"
            },
            "localisation_en": "Stone Wave Cliffs Cave",
            "localisation_fr": "",
            "obtention_en": "Beat the Chromatic Hexga at the end. Look to the left of it.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs Cave"
        },
        {
            "id": 154,
            "nom_en": "Solidifying",
            "nom_fr": "Solidification",
            "traduction_confirmee": true,
            "effet_en": "+2 Shields when the character's Health falls below 50%. Once per battle.",
            "effet_fr": "",
            "statistiques": {
                "defense": "647",
                "vitesse": "266"
            },
            "localisation_en": "Sacred River",
            "localisation_fr": "",
            "obtention_en": "Buy from Merchant for 67,350 Chroma.",
            "obtention_fr": "",
            "zone": "Sacred River"
        },
        {
            "id": 155,
            "nom_en": "Critical Stun",
            "nom_fr": "Étourdissement critique",
            "traduction_confirmee": true,
            "effet_en": "100% on Critical Chance on hitting a Stunned target",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Sacred River",
            "localisation_fr": "",
            "obtention_en": "Buy from Merchant for 53,880 Chroma.",
            "obtention_fr": "",
            "zone": "Sacred River"
        },
        {
            "id": 156,
            "nom_en": "First Offensive",
            "nom_fr": "Première offensive",
            "traduction_confirmee": true,
            "effet_en": "First hit dealt and taken deals 50% more damage.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "75",
                "chances_crit": "0.13"
            },
            "localisation_en": "Abbest Cave",
            "localisation_fr": "",
            "obtention_en": "Beat Chromatic Abbest",
            "obtention_fr": "",
            "zone": "Abbest Cave"
        },
        {
            "id": 157,
            "nom_en": "Energising Attack I",
            "nom_fr": "Énergie — Attaque I",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on base attack",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "895",
                "chances_crit": "0.17"
            },
            "localisation_en": "Painting Workshop",
            "localisation_fr": "",
            "obtention_en": "Solve the Painting Workshop mystery and defeat the Lampmaster",
            "obtention_fr": "",
            "zone": "Painting Workshop"
        },
        {
            "id": 158,
            "nom_en": "The One",
            "nom_fr": "Plus qu'un",
            "traduction_confirmee": true,
            "effet_en": "Max Health is reduced to 1",
            "effet_fr": "",
            "statistiques": {
                "chances_crit": "1.08"
            },
            "localisation_en": "Sunless Cliffs",
            "localisation_fr": "",
            "obtention_en": "Beat the Mime at the Portal.",
            "obtention_fr": "",
            "zone": "Sunless Cliffs"
        },
        {
            "id": 159,
            "nom_en": "Base Shield",
            "nom_fr": "Bouclier basique",
            "traduction_confirmee": true,
            "effet_en": "+1 Shield if not affected by any Shield on turn start",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "378",
                "chances_crit": "0.11"
            },
            "localisation_en": "The Chosen Path",
            "localisation_fr": "",
            "obtention_en": "Defeat the mirror challenges and enter the double doors up the staircase.",
            "obtention_fr": "",
            "zone": "The Chosen Path"
        },
        {
            "id": 160,
            "nom_en": "Pro Retreat",
            "nom_fr": "Retraite assurée",
            "traduction_confirmee": false,
            "effet_en": "Allows Flee to be instantaneous",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Camp",
            "localisation_fr": "",
            "obtention_en": "Find all nine Lost Gestrals for Sastro",
            "obtention_fr": "",
            "zone": "Camp"
        },
        {
            "id": 161,
            "nom_en": "Burning Break",
            "nom_fr": "Fracture brûlante",
            "traduction_confirmee": true,
            "effet_en": "Apply 3 burn stacks on Breaking a target",
            "effet_fr": "",
            "statistiques": {
                "sante": "1541",
                "chances_crit": "0.24"
            },
            "localisation_en": "Frozen Hearts - Glacial Falls",
            "localisation_fr": "",
            "obtention_en": "If you're facing the bells near the flag, turn right and hug the wall. Run up the cliff, and then you'll see the Pictos across the way that you can jump to by using a frozen bell.",
            "obtention_fr": "",
            "zone": "Frozen Hearts - Glacial Falls"
        },
        {
            "id": 162,
            "nom_en": "Burn Affinity",
            "nom_fr": "Affinité brûlante",
            "traduction_confirmee": true,
            "effet_en": "25% increased damage on Burning targets",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "439",
                "chances_crit": "0.12"
            },
            "localisation_en": "Frozen Hearts - Glacial Falls",
            "localisation_fr": "",
            "obtention_en": "From the Flag, look out towards the flaming enemies to see a magic rope. Take it up to find an area with some Chroma. Follow the path up there to find a grappling hook. Use the handholds and then jump to a path on the right to find another grapple point leading to the Pictos.",
            "obtention_fr": "",
            "zone": "Frozen Hearts - Glacial Falls"
        },
        {
            "id": 163,
            "nom_en": "Death Bomb",
            "nom_fr": "Bombe Funèbre",
            "traduction_confirmee": true,
            "effet_en": "On Death, deal damage to all enemies.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Yellow Harvest - Harvester's Hollow",
            "localisation_fr": "",
            "obtention_en": "Pass the flag and head to the right of the tall stone statue. There is a short path to the right of the long ramp, and the Pictos is at the end.",
            "obtention_fr": "",
            "zone": "Yellow Harvest - Harvester's Hollow"
        },
        {
            "id": 164,
            "nom_en": "Auto Death",
            "nom_fr": "Mort immédiate",
            "traduction_confirmee": false,
            "effet_en": "Kill self on battle start",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Yellow Harvest (Harvester's Hollow)",
            "localisation_fr": "",
            "obtention_en": "Buy from nearby Merchant for 5320 Chroma. From the flag, head towards the right to find a slope that leads to an area with blue lamps. You'll find a grapple point.",
            "obtention_fr": "",
            "zone": "Yellow Harvest"
        },
        {
            "id": 165,
            "nom_en": "Teamwork",
            "nom_fr": "Travail d'équipe",
            "traduction_confirmee": false,
            "effet_en": "10% increased damage while all allies are alive",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Yellow Harvest (Harvester's Hollow)",
            "localisation_fr": "",
            "obtention_en": "From the flag, go straight into the large clearing. Stay on the right until you find a large slope that leads to an area with lamps. Use the grapple point at the end to find a Merchant.",
            "obtention_fr": "",
            "zone": "Yellow Harvest"
        },
        {
            "id": 166,
            "nom_en": "Quick Break",
            "nom_fr": "Fracture accélérante",
            "traduction_confirmee": true,
            "effet_en": "Play again after Breaking a target",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "672",
                "chances_crit": "0.36"
            },
            "localisation_en": "Renoir's Drafts - Entrance",
            "localisation_fr": "",
            "obtention_en": "Hook a left after passing the flag to find a grapple point.",
            "obtention_fr": "",
            "zone": "Renoir's Drafts - Entrance"
        },
        {
            "id": 167,
            "nom_en": "Aegis Revival",
            "nom_fr": "Renaissance protégée",
            "traduction_confirmee": true,
            "effet_en": "+1 Shield after being revived",
            "effet_fr": "",
            "statistiques": {
                "defense": "1990",
                "vitesse": "672"
            },
            "localisation_en": "Renoir's Drafts - Entrance",
            "localisation_fr": "",
            "obtention_en": "Follow the main path until you reach the fading man. Walk down the slope on the right once you pass him. Hook a left before entering the round gate to find a slope that leads to a grapple point and a Merchant.",
            "obtention_fr": "",
            "zone": "Renoir's Drafts - Entrance"
        },
        {
            "id": 168,
            "nom_en": "Charging Burn",
            "nom_fr": "Charges sur brûlure",
            "traduction_confirmee": true,
            "effet_en": "+20% of a Gradient Charge on applying Burn. Once per turn.",
            "effet_fr": "",
            "statistiques": {
                "sante": "3152",
                "vitesse": "639"
            },
            "localisation_en": "Renoir's Drafts - Entrance",
            "localisation_fr": "",
            "obtention_en": "Follow the main path until you reach the fading man. Walk down the slope on the right once you pass him. Hook a left before entering the round gate to find a slope that leads to a grapple point and a Merchant. Jump on the bridge behind the Merchant.",
            "obtention_fr": "",
            "zone": "Renoir's Drafts - Entrance"
        },
        {
            "id": 169,
            "nom_en": "Recovery",
            "nom_fr": "Récupération",
            "traduction_confirmee": true,
            "effet_en": "Recovers 10% Health on turn start",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Red Woods",
            "localisation_fr": "",
            "obtention_en": "Donate Chroma to help Benisseur.",
            "obtention_fr": "",
            "zone": "Red Woods"
        },
        {
            "id": 170,
            "nom_en": "Combo Attack III",
            "nom_fr": "Attaque combo III",
            "traduction_confirmee": true,
            "effet_en": "Base Attack has 1 extra hit",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Dark Gestral Arena",
            "localisation_fr": "",
            "obtention_en": "Complete the Dark Gestral Arena",
            "obtention_fr": "",
            "zone": "Dark Gestral Arena"
        },
        {
            "id": 171,
            "nom_en": "Auto Powerful",
            "nom_fr": "Surpuissance immédiate",
            "traduction_confirmee": true,
            "effet_en": "Apply Powerful for 3 turns on battle start",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Floating Cemetery",
            "localisation_fr": "",
            "obtention_en": "Fight the Chalier.",
            "obtention_fr": "",
            "zone": "Floating Cemetery"
        },
        {
            "id": 172,
            "nom_en": "Survivor",
            "nom_fr": "Survivant",
            "traduction_confirmee": true,
            "effet_en": "Survive fatal damage with 1 Health. Once per battle.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Monoco's Station",
            "localisation_fr": "",
            "obtention_en": "Deliver the Eternal Ice to the Grandis Trader nearby.",
            "obtention_fr": "",
            "zone": "Monoco's Station"
        },
        {
            "id": 173,
            "nom_en": "Greater Rush",
            "nom_fr": "Rapidité améliorée",
            "traduction_confirmee": false,
            "effet_en": "+25% Rush Speed increase BOM",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Monoco's Station",
            "localisation_fr": "",
            "obtention_en": "The Greater Rush Pictos is purchasable from the Grandis merchant in Monoco's Station for 85,750 Chroma after retrieving the Eternal Ice from the Gargant in Frozen Hearts.",
            "obtention_fr": "",
            "zone": "Monoco's Station"
        },
        {
            "id": 174,
            "nom_en": "Shielding Death",
            "nom_fr": "Mort préservante",
            "traduction_confirmee": true,
            "effet_en": "On death, allies gain 3 Shield points.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "The Crows",
            "localisation_fr": "",
            "obtention_en": "Beat the Chromatic Chapelier at The Crows (shoot all the crows)",
            "obtention_fr": "",
            "zone": "The Crows"
        },
        {
            "id": 175,
            "nom_en": "Powerful Shield",
            "nom_fr": "Bouclier surpuissant",
            "traduction_confirmee": true,
            "effet_en": "10% Increased damage per Shield Point on self.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Endless Night Sanctuary",
            "localisation_fr": "",
            "obtention_en": "Purchase from the Merchant.",
            "obtention_fr": "",
            "zone": "Endless Night Sanctuary"
        },
        {
            "id": 176,
            "nom_en": "Powerful Heal",
            "nom_fr": "Soins surpuissants",
            "traduction_confirmee": true,
            "effet_en": "Healing an ally also applies Powerful for 1 turn.",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Endless Night Sanctuary",
            "localisation_fr": "",
            "obtention_en": "Purchase from the Merchant.",
            "obtention_fr": "",
            "zone": "Endless Night Sanctuary"
        },
        {
            "id": 177,
            "nom_en": "Protecting Attack",
            "nom_fr": "Attaque protectrice",
            "traduction_confirmee": true,
            "effet_en": "Gain Shell for 1 turn on Base Attack",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Endless Night Sanctuary",
            "localisation_fr": "",
            "obtention_en": "Purchase from the Merchant.",
            "obtention_fr": "",
            "zone": "Endless Night Sanctuary"
        },
        {
            "id": 178,
            "nom_en": "Charging Mark",
            "nom_fr": "Charges sur marque",
            "traduction_confirmee": true,
            "effet_en": "+20% of a Gradient Charge on hitting a Marked target. Once per turn",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Endless Night Sanctuary",
            "localisation_fr": "",
            "obtention_en": "Purchase from the Merchant.",
            "obtention_fr": "",
            "zone": "Endless Night Sanctuary"
        },
        {
            "id": 179,
            "nom_en": "Accelerating Tint",
            "nom_fr": "Teinte accélérante",
            "traduction_confirmee": false,
            "effet_en": "Healing Tints also apply Rush",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Endless Night Sanctuary",
            "localisation_fr": "",
            "obtention_en": "Purchase from the Merchant.",
            "obtention_fr": "",
            "zone": "Endless Night Sanctuary"
        },
        {
            "id": 180,
            "nom_en": "Shell On Rush",
            "nom_fr": "Carapace sur Rapidité",
            "traduction_confirmee": false,
            "effet_en": "Apply Shell on applying Rush",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Endless Night Sanctuary",
            "localisation_fr": "",
            "obtention_en": "Purchase from the Merchant.",
            "obtention_fr": "",
            "zone": "Endless Night Sanctuary"
        },
        {
            "id": 181,
            "nom_en": "Anti-Freeze",
            "nom_fr": "Anti-gel",
            "traduction_confirmee": true,
            "effet_en": "Immune to Freeze",
            "effet_fr": "",
            "statistiques": {},
            "localisation_en": "Frozen Hearts",
            "localisation_fr": "",
            "obtention_en": "Can be obtained upon destroying the Paint Cage in Glacial Falls past the Manor entrance.",
            "obtention_fr": "",
            "zone": "Frozen Hearts"
        },
        {
            "id": 182,
            "nom_en": "Critical Break",
            "nom_fr": "Fracture critique",
            "traduction_confirmee": true,
            "effet_en": "25% increased Break damage on Critical Hits.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "?",
                "chances_crit": "?"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "You can find the Pictos by destroying a Paint Spike on a beach northeast of The Reacher.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 183,
            "nom_en": "Critical Vulnerability",
            "nom_fr": "Critiques sur vulnérabilité",
            "traduction_confirmee": true,
            "effet_en": "25% increased Critical Chance on Defenceless enemies.",
            "effet_fr": "",
            "statistiques": {
                "defense": "?",
                "vitesse": "?"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "You can find the Pictos surrounded by Nevrons in an abandoned camp northwest of the Floating Cemetary.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 184,
            "nom_en": "Effective Support",
            "nom_fr": "Soutien efficace",
            "traduction_confirmee": true,
            "effet_en": "+2 AP on using an item.",
            "effet_fr": "",
            "statistiques": {
                "sante": "?",
                "vitesse": "?"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "You can find Effective Support Pictos surrounded by Nevrons northeast of Sirene.",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 185,
            "nom_en": "Energising Burn",
            "nom_fr": "Brûlure énergisante",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on applying Burn. Once per turn.",
            "effet_fr": "",
            "statistiques": {
                "defense": "?",
                "vitesse": "?"
            },
            "localisation_en": "Frozen Hearts",
            "localisation_fr": "",
            "obtention_en": "Energising Burn is obtained as a drop by defeating Chromatic Veilleur found at Frozen Hearts.",
            "obtention_fr": "",
            "zone": "Frozen Hearts"
        },
        {
            "id": 186,
            "nom_en": "Energising Stun",
            "nom_fr": "Étourdissement énergisant",
            "traduction_confirmee": true,
            "effet_en": "+1 AP on hitting a Stunned target with a Skill.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "?",
                "chances_crit": "?"
            },
            "localisation_en": "Flying Manor",
            "localisation_fr": "",
            "obtention_en": "Energising Stun is obtained as a reward for solving a Painted Cage puzzle in the Flying Manor area.",
            "obtention_fr": "",
            "zone": "Flying Manor"
        },
        {
            "id": 187,
            "nom_en": "Marking Break",
            "nom_fr": "Fracture marquante",
            "traduction_confirmee": true,
            "effet_en": "Apply Mark on Break.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "?",
                "chances_crit": "?"
            },
            "localisation_en": "Endless Night Sanctuary",
            "localisation_fr": "",
            "obtention_en": "Purchase from the Merchant.",
            "obtention_fr": "",
            "zone": "Endless Night Sanctuary"
        },
        {
            "id": 188,
            "nom_en": "Powerful Mark",
            "nom_fr": "Marque surpuissante",
            "traduction_confirmee": true,
            "effet_en": "Gain Powerful on hitting a Marked enemy.",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "?",
                "chances_crit": "?"
            },
            "localisation_en": "Flying Manor",
            "localisation_fr": "",
            "obtention_en": "You can find the Powerful Mark Pictos being guarded by two Steel Chevalieres on a platform in the Goblu boss area.",
            "obtention_fr": "",
            "zone": "Flying Manor"
        },
        {
            "id": 189,
            "nom_en": "Powerful Shots",
            "nom_fr": "Tirs surpuissants",
            "traduction_confirmee": true,
            "effet_en": "20% chance to gain Powerful on Free Aim shot.",
            "effet_fr": "",
            "statistiques": {
                "sante": "?",
                "defense": "?"
            },
            "localisation_en": "Gestral Village",
            "localisation_fr": "",
            "obtention_en": "You can find the Powerful Shots Pictos by breaking a Paint Spike near the Gestral doctor.",
            "obtention_fr": "",
            "zone": "Gestral Village"
        },
        {
            "id": 190,
            "nom_en": "Rejuvenating Revive",
            "nom_fr": "Renaissance revigorante",
            "traduction_confirmee": false,
            "effet_en": "Apply Regen for 3 turns when revived.",
            "effet_fr": "",
            "statistiques": {
                "sante": "?",
                "defense": "?"
            },
            "localisation_en": "Stone Wave Cliffs",
            "localisation_fr": "",
            "obtention_en": "You can get the Rejuvenating Revive Pictos after breaking a Paint Spike in the Old Farm area.",
            "obtention_fr": "",
            "zone": "Stone Wave Cliffs"
        },
        {
            "id": 191,
            "nom_en": "Shielding Tint",
            "nom_fr": "Teinte préservante",
            "traduction_confirmee": false,
            "effet_en": "Healing Tints also add 2 Shields.",
            "effet_fr": "",
            "statistiques": {
                "sante": "313",
                "defense": "116"
            },
            "localisation_en": "The Continent",
            "localisation_fr": "",
            "obtention_en": "This can be found on the ground under wooden crates near the Bourgeon southeast of Forgotten Battlefield (requires Esquie flight).",
            "obtention_fr": "",
            "zone": "The Continent"
        },
        {
            "id": 192,
            "nom_en": "Protecting Shots",
            "nom_fr": "Tirs protecteurs",
            "traduction_confirmee": false,
            "effet_en": "20% chance to gain Shell on Free Aim shot.",
            "effet_fr": "",
            "statistiques": {
                "sante": "?",
                "defense": "?"
            },
            "localisation_en": "Flying Manor",
            "localisation_fr": "",
            "obtention_en": "After entering the Flying Manor, go down the first flight of stairs facing the Nevron statue, then turn right and jump off the staircase leading to a cliff.\nGo down the rope and continue walking to the right. You'll find the Pictos sitting on the edge of a broken picture frame.",
            "obtention_fr": "",
            "zone": "Flying Manor"
        },
        {
            "id": 193,
            "nom_en": "Gradient Break",
            "nom_fr": "Fracture Gradient",
            "traduction_confirmee": true,
            "effet_en": "",
            "effet_fr": "",
            "statistiques": {
                "vitesse": "?",
                "chances_crit": "?"
            },
            "localisation_en": "Endless Night Sanctuary",
            "localisation_fr": "",
            "obtention_en": "The Gradient Break Pictos can be found in a tiny alcove in the passage between the two paths past the behind the Grandis Engineer in Endless Night Sanctuary.",
            "obtention_fr": "",
            "zone": "Endless Night Sanctuary"
        }
    ]
};
