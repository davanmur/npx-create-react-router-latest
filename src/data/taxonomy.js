export const TAXONOMY = {
  id: "viridiplantae", name: "Viridiplantae", rank: "kingdom",
  desc: "Green plants — all land plants and green algae sharing chlorophyll a and b.",
  children: [
    {
      id: "embryophyta", name: "Embryophyta", rank: "subkingdom",
      desc: "Land plants with protected embryos.",
      children: [
        {
          id: "tracheophyta", name: "Tracheophyta", rank: "division",
          desc: "Vascular plants with xylem and phloem.",
          children: [
            {
              id: "angiospermae", name: "Angiospermae", rank: "class",
              desc: "Flowering plants — seeds enclosed in fruit.",
              children: [
                {
                  id: "eudicots", name: "Eudicots", rank: "clade",
                  desc: "Plants with two seed leaves and tricolpate pollen.",
                  children: [
                    {
                      id: "rosids", name: "Rosids", rank: "clade",
                      desc: "A major eudicot clade, ~70,000 species.",
                      children: [
                        {
                          id: "fabales", name: "Fabales", rank: "order",
                          desc: "Legumes and allies.",
                          children: [
                            {
                              id: "fabaceae", name: "Fabaceae", rank: "family",
                              desc: "The legume / pea family.",
                              children: [
                                { id: "pisum", name: "Pisum sativum", rank: "species", desc: "Garden pea — one of the oldest cultivated crops, used by Mendel.", children: [] },
                                { id: "glycine", name: "Glycine max", rank: "species", desc: "Soybean — major source of protein and oil worldwide.", children: [] },
                                { id: "phaseolus", name: "Phaseolus vulgaris", rank: "species", desc: "Common bean — kidney, black, and pinto beans all belong here.", children: [] },
                              ],
                            },
                          ],
                        },
                        {
                          id: "rosales", name: "Rosales", rank: "order",
                          desc: "Roses, apples, figs, and cannabis.",
                          children: [
                            {
                              id: "rosaceae", name: "Rosaceae", rank: "family",
                              desc: "The rose family — fruits like apple, cherry, pear.",
                              children: [
                                { id: "malus", name: "Malus domestica", rank: "species", desc: "Apple — cultivated for over 4,000 years, thousands of varieties.", children: [] },
                                { id: "rosa", name: "Rosa", rank: "genus", desc: "Roses — over 300 species, iconic ornamental flowers.", children: [] },
                                { id: "prunus", name: "Prunus", rank: "genus", desc: "Stone fruits: cherry, plum, peach, almond.", children: [] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: "asterids", name: "Asterids", rank: "clade",
                      desc: "Daisy-like clade including mints, tomatoes, and coffee.",
                      children: [
                        {
                          id: "solanales", name: "Solanales", rank: "order",
                          desc: "Nightshades and allies.",
                          children: [
                            {
                              id: "solanaceae", name: "Solanaceae", rank: "family",
                              desc: "Nightshade family — potatoes, tomatoes, peppers.",
                              children: [
                                { id: "solanum_lyc", name: "Solanum lycopersicum", rank: "species", desc: "Tomato — technically a fruit, globally the most consumed 'vegetable'.", children: [] },
                                { id: "solanum_tub", name: "Solanum tuberosum", rank: "species", desc: "Potato — fourth most important food crop worldwide.", children: [] },
                                { id: "capsicum", name: "Capsicum annuum", rank: "species", desc: "Bell and chili pepper — capsaicin gives heat.", children: [] },
                              ],
                            },
                          ],
                        },
                        {
                          id: "lamiales", name: "Lamiales", rank: "order",
                          desc: "Mints, snapdragons, olives, and many aromatic herbs.",
                          children: [
                            {
                              id: "lamiaceae", name: "Lamiaceae", rank: "family",
                              desc: "The mint family — aromatic herbs.",
                              children: [
                                { id: "mentha", name: "Mentha", rank: "genus", desc: "Mints — spearmint, peppermint, used in food and medicine.", children: [] },
                                { id: "lavandula", name: "Lavandula", rank: "genus", desc: "Lavender — fragrant flowers used in aromatherapy.", children: [] },
                                { id: "ocimum", name: "Ocimum basilicum", rank: "species", desc: "Basil — essential herb in Italian and Southeast Asian cuisines.", children: [] },
                                { id: "rosmarinus", name: "Salvia rosmarinus", rank: "species", desc: "Rosemary — aromatic shrub, formerly Rosmarinus officinalis.", children: [] },
                              ],
                            },
                          ],
                        },
                        {
                          id: "asterales", name: "Asterales", rank: "order",
                          desc: "Daisies, sunflowers, and allies.",
                          children: [
                            {
                              id: "asteraceae", name: "Asteraceae", rank: "family",
                              desc: "The daisy family — largest angiosperm family.",
                              children: [
                                { id: "helianthus", name: "Helianthus annuus", rank: "species", desc: "Sunflower — heliotropic plant, major source of edible oil.", children: [] },
                                { id: "taraxacum", name: "Taraxacum officinale", rank: "species", desc: "Dandelion — considered a weed, but edible and medicinal.", children: [] },
                                { id: "lactuca", name: "Lactuca sativa", rank: "species", desc: "Lettuce — ancient cultivated leafy vegetable.", children: [] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "monocots", name: "Monocots", rank: "clade",
                  desc: "Plants with a single seed leaf — grasses, lilies, palms.",
                  children: [
                    {
                      id: "poales", name: "Poales", rank: "order",
                      desc: "Grasses, sedges, and allies.",
                      children: [
                        {
                          id: "poaceae", name: "Poaceae", rank: "family",
                          desc: "The grass family — wheat, rice, corn.",
                          children: [
                            { id: "oryza", name: "Oryza sativa", rank: "species", desc: "Rice — staple food for over half the world's population.", children: [] },
                            { id: "triticum", name: "Triticum aestivum", rank: "species", desc: "Wheat — most widely grown cereal crop globally.", children: [] },
                            { id: "zea", name: "Zea mays", rank: "species", desc: "Corn / maize — used as food, feed, fuel, and industrial starch.", children: [] },
                          ],
                        },
                      ],
                    },
                    {
                      id: "asparagales", name: "Asparagales", rank: "order",
                      desc: "Orchids, alliums, and asparagus.",
                      children: [
                        {
                          id: "amaryllidaceae", name: "Amaryllidaceae", rank: "family",
                          desc: "Onion family — garlic, leeks, chives.",
                          children: [
                            { id: "allium_sat", name: "Allium sativum", rank: "species", desc: "Garlic — used as food and medicine for thousands of years.", children: [] },
                            { id: "allium_cepa", name: "Allium cepa", rank: "species", desc: "Onion — one of the oldest cultivated vegetables.", children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "gymnospermae", name: "Gymnospermae", rank: "class",
              desc: "Seed plants without enclosed ovaries — conifers, cycads.",
              children: [
                {
                  id: "pinales", name: "Pinales", rank: "order",
                  desc: "Conifers — the dominant gymnosperm group.",
                  children: [
                    {
                      id: "pinaceae", name: "Pinaceae", rank: "family",
                      desc: "Pine family — pines, firs, spruces, larches.",
                      children: [
                        { id: "pinus", name: "Pinus", rank: "genus", desc: "Pines — over 120 species, iconic cone-bearing trees.", children: [] },
                        { id: "abies", name: "Abies", rank: "genus", desc: "Firs — used as Christmas trees and for timber.", children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const RANK_COLORS = {
  kingdom: "#639922",
  subkingdom: "#639922",
  division: "#3B6D11",
  class: "#185FA5",
  clade: "#378ADD",
  order: "#534AB7",
  family: "#7F77DD",
  genus: "#D85A30",
  species: "#993C1D",
  default: "#888780",
};

export const KNOWN_PARENT_IDS = [
  "viridiplantae","embryophyta","tracheophyta","angiospermae","eudicots",
  "rosids","asterids","monocots","gymnospermae","fabales","fabaceae",
  "rosales","rosaceae","solanales","solanaceae","lamiales","lamiaceae",
  "asterales","asteraceae","poales","poaceae","asparagales","amaryllidaceae",
  "pinales","pinaceae",
];

export function allNodes(node, list = []) {
  list.push(node);
  (node.children || []).forEach((c) => allNodes(c, list));
  return list;
}

export function findById(id, node = TAXONOMY) {
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findById(id, child);
    if (found) return found;
  }
  return null;
}
