// randomWords.js

export const randomWords = [
    "nonstop", "detailed", "aspiring", "shock", "play", "bashful", "long", "quarter",
    "six", "charge", "dock", "crabby", "dime", "wry", "story", "wiry", "rampant",
    "return", "dare", "open", "shame", "many", "brush", "babies", "stem", "squeeze",
    "judge", "heavenly", "defeated", "optimal", "invention", "object", "change",
    "sink", "verdant", "jaded", "adjoining", "muddled", "switch", "helpless",
    "motionless", "skirt", "shrug", "trip", "haircut", "oven", "lip", "habitual",
    "yielding", "bag", "wheel", "attach", "ticket", "visit", "reflect", "suppose",
    "present", "wound", "voyage", "real", "aunt", "religion", "redundant", "necessary",
    "fail", "flower", "unpack", "join", "gamy", "tired", "welcome", "rightful", "jeans",
    "obscene", "spring", "basket", "battle", "utter", "descriptive", "caring", "fry",
    "resonant", "supply", "geese", "pets", "impulse", "scintillating", "tame", "release",
    "tail", "depend", "lively", "nondescript", "punishment", "meek", "crooked",
    "representative", "twist", "manage", "bored", "grotesque", "demonic", "camp",
    "temporary", "coil", "passenger", "appliance", "clam", "smoggy", "tasteless", "guess",
    "verse", "drab", "peep", "business", "paper", "female", "admire", "way", "moor",
    "breezy", "opposite", "comparison", "tank", "suit", "ludicrous", "minister", "stiff",
    "whine", "request", "camera", "internal", "improve", "unnatural", "decisive", "exist",
    "grip", "electric", "bathe", "scandalous", "steer", "humdrum", "action", "rot",
    "roll", "quartz", "amused", "sidewalk", "roll", "curve"
];

export function getRandomWordsFromFile() {
    let randomWordsSelected = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * randomWords.length);
        randomWordsSelected.push(randomWords[randomIndex]);
    }
    return randomWordsSelected.join('-');
}