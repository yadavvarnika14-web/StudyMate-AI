// build-curriculum.js
// Generates comprehensive study notes for Classes 5 through 12 across all major subjects.
const fs = require('fs');
const path = require('path');

const curriculum = [
  // Class 5
  {
    id: 'c5_sci_plants',
    classNum: 5,
    subject: 'Science',
    title: 'Plant Reproduction and Seed Dispersal',
    summary: 'Covers seeds, germination stages, and natural methods of seed dispersal (wind, water, animals, and explosion).',
    content: `# Class 5: Science - Plant Reproduction and Seed Dispersal

## 1. Structure of a Seed
A seed has three main parts:
1. **Seed Coat (Testa):** The outer protective layer that protects the baby plant inside.
2. **Seed Leaves (Cotyledons):** Store food for the growing baby plant (embryo).
   - *Monocot seeds:* Have one cotyledon (e.g., maize, rice, wheat).
   - *Dicot seeds:* Have two cotyledons (e.g., gram, pea, bean).
3. **Embryo:** The baby plant consisting of the radicle (develops into root) and plumule (develops into shoot).

## 2. Germination
Germination is the process where a seed grows into a young seedling.
- **Essential conditions:** Air (oxygen), Water (moisture), and Warmth (sunlight/temperature).

## 3. Agents of Seed Dispersal
Seeds need to travel away from parent plants to avoid overcrowding and competition for sunlight, water, and space.
- **Wind:** Light seeds with wings or hair (e.g., Dandelion, Cotton, Maple).
- **Water:** Spongy or fibrous outer covering (e.g., Coconut, Lotus).
- **Animals & Birds:** Fruits eaten by animals; hooked/spiny seeds that cling to fur or feathers (e.g., Xanthium, Tiger nail, Berries).
- **Explosion/Bursting:** Pods burst open suddenly when dried in the sun (e.g., Pea, Balsam, Ladyfinger).

## Key Review Points:
- Plants also reproduce vegetative parts: through stems (Potato, Ginger, Rose), roots (Sweet potato, Carrot), and leaves (Bryophyllum).`
  },
  {
    id: 'c5_math_fractions',
    classNum: 5,
    subject: 'Mathematics',
    title: 'Fractions and Decimals Essentials',
    summary: 'Comprehensive notes on types of fractions, conversions, addition, subtraction, and decimal representations.',
    content: `# Class 5: Mathematics - Fractions & Decimals

## 1. What is a Fraction?
A fraction represents a part of a whole or part of a collection. Written as Numerator / Denominator (N/D).

## 2. Types of Fractions
1. **Proper Fraction:** Numerator is smaller than Denominator (e.g., 3/7, 5/9). Value is less than 1.
2. **Improper Fraction:** Numerator is greater than or equal to Denominator (e.g., 8/5, 11/4). Value is 1 or greater.
3. **Mixed Fraction:** Combination of a whole number and a proper fraction (e.g., 2 1/3 = 7/3).
4. **Like & Unlike Fractions:**
   - Like: Same denominators (e.g., 2/7, 5/7).
   - Unlike: Different denominators (e.g., 3/4, 2/5).
5. **Equivalent Fractions:** Fractions having equal value obtained by multiplying or dividing numerator and denominator by the same non-zero number (e.g., 1/2 = 2/4 = 4/8).

## 3. Decimal Conversion
- Fraction with denominators 10, 100, 1000 can be written as decimals:
  - 7/10 = 0.7
  - 25/100 = 0.25
  - 125/1000 = 0.125
- Decimals place value: Tens | Ones . Tenths (1/10) | Hundredths (1/100) | Thousandths (1/1000).`
  },
  {
    id: 'c5_eng_grammar',
    classNum: 5,
    subject: 'English',
    title: 'Parts of Speech and Sentence Types',
    summary: 'Clear reference guide to Nouns, Pronouns, Verbs, Adjectives, Adverbs, Prepositions, Conjunctions, and Interjections.',
    content: `# Class 5: English - The 8 Parts of Speech

## 1. The Eight Parts of Speech
1. **Noun:** Name of a person, place, animal, or thing (e.g., Varnika, Delhi, Tiger, Book).
   - Proper, Common, Collective (flock, herd), Abstract (honesty, joy).
2. **Pronoun:** Word used in place of a noun (e.g., he, she, it, they, we).
3. **Verb:** An action word or state of being (e.g., run, write, is, are, was).
4. **Adjective:** Word that describes or modifies a noun (e.g., bright, tall, five, generous).
5. **Adverb:** Modifies a verb, adjective, or another adverb (often ends in -ly: quickly, softly, very, yesterday).
6. **Preposition:** Shows relationship of time, place, or direction (e.g., under, in, above, between, through).
7. **Conjunction:** Connecting words that join words or sentences (e.g., and, but, because, although).
8. **Interjection:** Expresses strong sudden emotions (e.g., Wow!, Ouch!, Hurray!).

## 2. Kinds of Sentences
- **Declarative (Statement):** Ends with a period. "She loves to read."
- **Interrogative (Question):** Ends with a question mark. "Where are you going?"
- **Imperative (Command/Request):** "Please submit your assignment."
- **Exclamatory (Sudden feeling):** "What a lovely surprise!"`
  },

  // Class 6
  {
    id: 'c6_sci_food_components',
    classNum: 6,
    subject: 'Science',
    title: 'Components of Food and Deficiency Diseases',
    summary: 'Nutrients overview (carbohydrates, fats, proteins, vitamins, minerals), dietary fiber, water, and deficiency diseases.',
    content: `# Class 6: Science - Components of Food

## 1. Major Nutrients
- **Carbohydrates:** Energy-giving nutrients (Starch & Sugars). Tested with Iodine (blue-black color).
- **Fats:** Provide more energy than carbohydrates gram for gram (Oils, Butter, Ghee, Nuts).
- **Proteins:** Body-building nutrients needed for growth and muscle repair (Pulses, Milk, Eggs, Fish). Tested with Copper Sulphate + Caustic Soda (violet color).
- **Vitamins:** Protective nutrients defending against diseases:
  - *Vitamin A:* Healthy eyes and skin (Carrots, Papaya).
  - *Vitamin B-complex:* Energy and nerve function (Whole grains, milk).
  - *Vitamin C:* Fights infections, healthy gums (Citrus fruits like lemons, amla).
  - *Vitamin D:* Strong bones and teeth with sunlight & calcium.
- **Minerals:** Calcium, Iron, Iodine, Phosphorus required in small amounts.

## 2. Dietary Fiber & Water
- **Roughage (Fiber):** Does not provide nutrients but adds bulk to undigested food and prevents constipation.
- **Water:** Absorbs nutrients from food and releases waste via sweat and urine.

## 3. Deficiency Diseases
- Vitamin A deficiency -> Night Blindness (poor vision in darkness).
- Vitamin B1 deficiency -> Beriberi (weak muscles, fatigue).
- Vitamin C deficiency -> Scurvy (bleeding gums, delayed wound healing).
- Vitamin D deficiency -> Rickets (soft and bent bones).
- Calcium deficiency -> Weak bones and tooth decay.
- Iodine deficiency -> Goitre (swollen neck gland, mental disability in children).
- Iron deficiency -> Anaemia (weakness, pale appearance).`
  },
  {
    id: 'c6_math_integers',
    classNum: 6,
    subject: 'Mathematics',
    title: 'Integers, Number Line, and Basic Operations',
    summary: 'Rules for negative numbers, number line plotting, absolute value, and integer addition and subtraction rules.',
    content: `# Class 6: Mathematics - Integers

## 1. What are Integers?
The collection of numbers consisting of positive numbers (1, 2, 3...), zero (0), and negative numbers (-1, -2, -3...) are called Integers:
... -3, -2, -1, 0, +1, +2, +3 ...
- Zero is neither positive nor negative.
- Every positive integer is greater than every negative integer.

## 2. Number Line Representation
- Numbers to the right of zero are positive and increase in value.
- Numbers to the left of zero are negative and decrease in value.
- For example: -5 is smaller than -2 because -5 is further to the left.

## 3. Rules for Integer Addition & Subtraction
1. **Same Signs:** Add the absolute values and keep the common sign.
   - (+4) + (+6) = +10
   - (-4) + (-6) = -10
2. **Different Signs:** Subtract the smaller value from the greater value and use the sign of the larger number.
   - (+8) + (-3) = +5
   - (-8) + (+3) = -5
3. **Subtracting an Integer:** Adding its additive inverse:
   - a - (-b) = a + b
   - 7 - (-5) = 7 + 5 = 12`
  },
  {
    id: 'c6_sst_civilization',
    classNum: 6,
    subject: 'Social Science',
    title: 'The Harappan Civilization (Indus Valley)',
    summary: 'Town planning, Great Bath, drainage system, trade, seals, and reasons for the decline of Indus Valley civilization.',
    content: `# Class 6: Social Science - In the Earliest Cities (Indus Valley Civilization)

## 1. Discovery and Geography
- Discovered in the 1920s (Harappa and Mohenjo-daro).
- Located along the Indus river valley in modern India and Pakistan.

## 2. Distinct Town Planning
- Divided into two parts:
  - **Citadel:** High, fortified western part containing public buildings and granaries.
  - **Lower Town:** Eastern part consisting of residential quarters for common people.
- Interlocking brickwork technique gave buildings immense durability.
- **The Great Bath (Mohenjo-daro):** Special tank lined with bricks, coated with plaster, and sealed with natural tar. Used for ritual bathing.

## 3. Remarkable Drainage System
- Covered drains running in straight lines along streets.
- Inspection holes at regular intervals for cleaning.
- Houses had bathrooms connected to street drains through gentle slopes.

## 4. Crafts and Economy
- Copper, bronze tools, gold and silver ornaments.
- Distinctive terracotta toys, spindle whorls, and steatite seals with animal motifs.
- Dockyard found at **Lothal (Gujarat)** indicates maritime trade with Mesopotamia.`
  },

  // Class 7
  {
    id: 'c7_sci_nutrition_plants',
    classNum: 7,
    subject: 'Science',
    title: 'Nutrition in Plants & Animals',
    summary: 'Autotrophic & heterotrophic nutrition, photosynthesis equation, saprophytes, parasites, and human digestion stages.',
    content: `# Class 7: Science - Nutrition in Plants & Animals

## 1. Modes of Nutrition in Plants
- **Autotrophic:** Organisms make their own food from simple inorganic substances (Green plants).
- **Heterotrophic:** Depend on autotrophs directly or indirectly:
  - *Parasites:* Feed on host without killing it (e.g., Cuscuta / Amarbel).
  - *Saprophytes:* Digest dead decaying matter (e.g., Fungi, Mushrooms).
  - *Insectivorous plants:* Grow in nitrogen-deficient soils and trap insects (e.g., Pitcher plant, Venus flytrap).
  - *Symbiosis:* Mutual benefit relationship (e.g., Lichens = Alga + Fungus; Rhizobium in legume roots).

## 2. Photosynthesis Reaction
Carbon dioxide + Water --[Sunlight + Chlorophyll]--> Glucose + Oxygen
- Raw materials: CO2 (via stomata), Water and minerals (via roots & xylem vessels), Sunlight (trapped by chlorophyll).

## 3. Human Digestive System
1. **Mouth (Ingestion):** Salivary amylase breaks starch into maltose.
2. **Oesophagus:** Peristaltic movement pushes bolus downwards.
3. **Stomach:** Gastric juice (HCl kills bacteria, pepsin digests protein, mucus protects wall).
4. **Small Intestine:** Complete digestion with bile (liver) and pancreatic juice. Absorption through finger-like villi.
5. **Large Intestine:** Reabsorbs water; expels solid waste via rectum & anus.`
  },
  {
    id: 'c7_math_algebraic_expressions',
    classNum: 7,
    subject: 'Mathematics',
    title: 'Algebraic Expressions & Simple Equations',
    summary: 'Variables, constants, coefficients, like vs unlike terms, monomials, binomials, polynomials, and linear equations.',
    content: `# Class 7: Mathematics - Algebraic Expressions & Simple Equations

## 1. Terms, Factors & Coefficients
- **Variable:** A symbol whose value can change (represented by letters: x, y, z).
- **Constant:** A fixed numerical value (e.g., 5, -8).
- **Term:** Product of factors (e.g., in expression 4x^2 - 3xy, the terms are 4x^2 and -3xy).
- **Coefficient:** Numerical factor of a term (Coefficient of x in 7x is 7).

## 2. Classification by Number of Terms
- **Monomial:** 1 term (e.g., 5x, 7y^2).
- **Binomial:** 2 terms (e.g., 2a + 3b).
- **Trinomial:** 3 terms (e.g., x^2 + 2x + 1).
- **Polynomial:** General expression with one or more non-zero terms with whole number exponents.

## 3. Like vs. Unlike Terms
- **Like Terms:** Have the same algebraic variables with identical exponents (e.g., 7xy and -3xy). Only like terms can be added or subtracted directly!
- **Unlike Terms:** Different variables or exponents (e.g., 4x and 4x^2).

## 4. Solving Simple Linear Equations
- Whatever mathematical operation is applied to the Left Hand Side (LHS) must be applied equally to the Right Hand Side (RHS).
- Example: 3x + 7 = 22
  - Subtract 7 from both sides: 3x = 15
  - Divide both sides by 3: x = 5.`
  },

  // Class 8
  {
    id: 'c8_sci_force_pressure',
    classNum: 8,
    subject: 'Science',
    title: 'Force, Pressure, and Friction',
    summary: 'Types of forces (contact vs non-contact), formula for pressure, atmospheric pressure, and laws of friction.',
    content: `# Class 8: Science - Force and Pressure

## 1. What is Force?
A push or a pull acting on an object resulting from its interaction with another object.
- **Unit of Force:** Newton (N).
- Force can change: state of motion, speed, direction, or shape of an object.

## 2. Types of Forces
1. **Contact Forces:**
   - *Muscular force:* Force exerted by muscles (lifting, walking).
   - *Frictional force:* Always opposes relative motion between two surfaces in contact.
2. **Non-Contact Forces:**
   - *Gravitational force:* Attractive force exerted by masses (Earth pulls objects toward center).
   - *Electrostatic force:* Force exerted by charged bodies on other charged or uncharged bodies.
   - *Magnetic force:* Attraction/repulsion between magnetic poles.

## 3. Pressure
Pressure is defined as the force acting per unit area of a surface:
**Pressure = Force / Area (P = F / A)**
- **Unit:** Pascal (Pa) or N/m^2.
- Smaller area produces higher pressure for the same force (e.g., sharp needle, nail, knife).
- Larger area reduces pressure (e.g., broad straps of school bags, tractor tires).

## 4. Liquid & Atmospheric Pressure
- Liquid pressure increases with depth and acts equally in all directions at the same level.
- Atmospheric pressure is the weight of air column above us; decreases with altitude.`
  },
  {
    id: 'c8_math_linear_equations',
    classNum: 8,
    subject: 'Mathematics',
    title: 'Linear Equations in One Variable & Quadrilaterals',
    summary: 'Solving linear equations with variables on both sides, word problems, and properties of parallelograms, rhombuses, and rectangles.',
    content: `# Class 8: Mathematics - Linear Equations & Geometry

## 1. Linear Equations in One Variable
An equation of the form ax + b = c (where a != 0) with degree 1.
- **Transposition Method:** Moving a term across the '=' sign reverses its sign:
  - Positive (+) becomes Negative (-)
  - Multiplication (x) becomes Division (/)
- Example:
  - 5x - 3 = 2x + 12
  - 5x - 2x = 12 + 3
  - 3x = 15 => x = 5

## 2. Understanding Quadrilaterals
- Sum of interior angles of an n-sided polygon = (n - 2) * 180 degrees.
  - Quadrilateral (4 sides): (4 - 2) * 180 = 360 degrees.
- Sum of exterior angles of ANY convex polygon = 360 degrees.

## 3. Special Quadrilaterals and Properties
1. **Parallelogram:**
   - Opposite sides are parallel and equal.
   - Opposite angles are equal.
   - Diagonals bisect each other.
2. **Rhombus:**
   - Parallelogram with all 4 sides equal.
   - Diagonals bisect each other at right angles (90 degrees).
3. **Rectangle:**
   - Parallelogram with each angle equal to 90 degrees.
   - Diagonals are equal in length and bisect each other.
4. **Square:**
   - All 4 sides equal, each angle is 90 degrees.
   - Diagonals are equal and bisect perpendicularly.`
  },

  // Class 9
  {
    id: 'c9_sci_matter_motion',
    classNum: 9,
    subject: 'Science',
    title: 'Motion, Laws of Motion & Matter in Our Surroundings',
    summary: 'Kinematic equations, Newtons three laws of motion, momentum, states of matter, and latent heat.',
    content: `# Class 9: Science - Physics & Chemistry Core

## 1. Kinematics & Equations of Motion
- **Speed:** Distance / Time (Scalar quantity).
- **Velocity:** Displacement / Time (Vector quantity, has magnitude and direction).
- **Acceleration:** Rate of change of velocity: a = (v - u) / t.
- **The Three Equations of Uniformly Accelerated Motion:**
  1. v = u + at
  2. s = ut + (1/2)at^2
  3. v^2 = u^2 + 2as
  *(where u = initial velocity, v = final velocity, a = acceleration, t = time, s = distance/displacement)*

## 2. Newton's Three Laws of Motion
1. **First Law (Inertia):** An object remains at rest or in uniform motion unless acted upon by an external net force.
2. **Second Law (Force):** F = ma. Rate of change of momentum is proportional to applied force.
   - Momentum: p = mv (kg*m/s).
3. **Third Law (Action-Reaction):** For every action, there is an equal and opposite reaction.

## 3. Chemistry: States of Matter
- **Solid, Liquid, Gas, Plasma, Bose-Einstein Condensate.**
- **Sublimation:** Solid directly converts to gas without becoming liquid (e.g., Camphor, Dry ice, Ammonium chloride).
- **Latent Heat:** Heat energy absorbed or released during phase change without temperature change:
  - *Latent Heat of Fusion:* Solid to liquid.
  - *Latent Heat of Vaporization:* Liquid to gas.`
  },
  {
    id: 'c9_math_number_systems',
    classNum: 9,
    subject: 'Mathematics',
    title: 'Real Numbers, Polynomials & Coordinate Geometry',
    summary: 'Rational vs irrational numbers, rationalization of surds, Remainder & Factor theorems, and Cartesian plane coordinates.',
    content: `# Class 9: Mathematics - Real Numbers, Polynomials & Coordinates

## 1. Real Numbers
- **Rational Numbers (Q):** Can be expressed as p/q (where p, q are integers, q != 0). Decimal expansion is terminating or non-terminating recurring.
- **Irrational Numbers:** Cannot be written as p/q. Decimal expansion is non-terminating and non-recurring (e.g., sqrt(2), sqrt(3), pi).
- **Rationalizing the Denominator:**
  - To rationalize 1 / (sqrt(a) + sqrt(b)), multiply numerator and denominator by conjugate (sqrt(a) - sqrt(b)).

## 2. Polynomials & Factorization
- **Degree of Polynomial:** Highest power of variable in the expression.
  - Linear (deg 1), Quadratic (deg 2), Cubic (deg 3).
- **Remainder Theorem:** If polynomial p(x) is divided by (x - a), the remainder is p(a).
- **Factor Theorem:** (x - a) is a factor of p(x) if and only if p(a) = 0.
- **Key Algebraic Identities:**
  - (a + b)^2 = a^2 + 2ab + b^2
  - (a - b)^2 = a^2 - 2ab + b^2
  - a^2 - b^2 = (a - b)(a + b)
  - (a + b + c)^2 = a^2 + b^2 + c^2 + 2ab + 2bc + 2ca
  - a^3 + b^3 = (a + b)(a^2 - ab + b^2)
  - a^3 - b^3 = (a - b)(a^2 + ab + b^2)

## 3. Coordinate Geometry
- Cartesian Plane: X-axis (horizontal abscissa) and Y-axis (vertical ordinate) intersecting at Origin (0,0).
- Quadrant I (+, +), Quadrant II (-, +), Quadrant III (-, -), Quadrant IV (+, -).`
  },

  // Class 10
  {
    id: 'c10_sci_chemical_reactions',
    classNum: 10,
    subject: 'Science',
    title: 'Chemical Reactions, Acids, Bases & Electricity',
    summary: 'Types of chemical reactions, balancing equations, pH scale, Ohm\'s law, series vs parallel circuits, and electric power.',
    content: `# Class 10: Science - Chemistry & Electricity Revision

## 1. Chemical Reactions & Equations
- **Combination:** A + B -> AB (e.g., CaO + H2O -> Ca(OH)2 + Heat).
- **Decomposition:** AB -> A + B (Thermal, Electrolytic, Photolytic).
- **Displacement:** More reactive metal displaces less reactive metal (e.g., Fe + CuSO4 -> FeSO4 + Cu).
- **Double Displacement:** Ion exchange (e.g., Na2SO4 + BaCl2 -> BaSO4(ppt) + 2NaCl).
- **Redox:** Oxidation (gain of O2 or loss of e-) and Reduction (loss of O2 or gain of e-) occurring simultaneously.

## 2. Acids, Bases & Salts
- **pH Scale (0 to 14):**
  - pH < 7: Acidic (red in litmus).
  - pH = 7: Neutral (Pure water).
  - pH > 7: Basic/Alkaline (blue in litmus).
- **Important Industrial Salts:**
  - Bleaching Powder: CaOCl2
  - Baking Soda: NaHCO3
  - Washing Soda: Na2CO3.10H2O
  - Plaster of Paris: CaSO4. 1/2 H2O (reacts with water to form Gypsum CaSO4.2H2O).

## 3. Electricity (Physics)
- **Ohm's Law:** V = IR (at constant temperature, current is directly proportional to potential difference).
- **Resistance:** R = rho * (L / A), where rho is resistivity.
- **Resistors in Series:** R_total = R1 + R2 + R3.
- **Resistors in Parallel:** 1 / R_total = 1/R1 + 1/R2 + 1/R3.
- **Joule's Law of Heating:** H = I^2 * R * t.
- **Electric Power:** P = VI = I^2 * R = V^2 / R (Unit: Watt; 1 kWh = 3.6 x 10^6 Joules).`
  },
  {
    id: 'c10_math_trigonometry_quadratics',
    classNum: 10,
    subject: 'Mathematics',
    title: 'Trigonometry & Quadratic Equations',
    summary: 'Trig ratios (sin, cos, tan), standard angle values, trigonometric identities, quadratic formula, and discriminant nature of roots.',
    content: `# Class 10: Mathematics - Trigonometry & Quadratic Equations

## 1. Quadratic Equations
Standard form: ax^2 + bx + c = 0 (a != 0).
- **Quadratic Formula:** x = [-b +- sqrt(b^2 - 4ac)] / (2a)
- **Discriminant (D = b^2 - 4ac) determines Nature of Roots:**
  - D > 0: Two distinct real roots.
  - D = 0: Two equal real roots (x = -b / 2a).
  - D < 0: No real roots (roots are complex).

## 2. Introduction to Trigonometry
In a right-angled triangle (Perpendicular P, Base B, Hypotenuse H):
- sin(theta) = P / H
- cos(theta) = B / H
- tan(theta) = P / B = sin / cos
- cosec(theta) = 1 / sin = H / P
- sec(theta) = 1 / cos = H / B
- cot(theta) = 1 / tan = B / P

## 3. Standard Angles Table
| Angle | 0 deg | 30 deg | 45 deg | 60 deg | 90 deg |
|---|---|---|---|---|---|
| sin | 0 | 1/2 | 1/sqrt(2) | sqrt(3)/2 | 1 |
| cos | 1 | sqrt(3)/2 | 1/sqrt(2) | 1/2 | 0 |
| tan | 0 | 1/sqrt(3) | 1 | sqrt(3) | Undefined |

## 4. Fundamental Trigonometric Identities
1. sin^2(theta) + cos^2(theta) = 1
2. 1 + tan^2(theta) = sec^2(theta)
3. 1 + cot^2(theta) = cosec^2(theta)`
  },

  // Class 11
  {
    id: 'c11_phy_mechanics_thermo',
    classNum: 11,
    subject: 'Physics',
    title: 'Classical Mechanics & Thermodynamics',
    summary: 'Vectors, projectile motion, rotational dynamics (torque, moment of inertia), gravitation, and first & second laws of thermodynamics.',
    content: `# Class 11: Physics - Mechanics & Thermodynamics

## 1. Projectile Motion
- Initial launch velocity u at angle theta to horizontal:
  - Horizontal component: u_x = u*cos(theta) (constant, zero acceleration).
  - Vertical component: u_y = u*sin(theta) - gt.
- **Time of Flight:** T = (2*u*sin(theta)) / g
- **Maximum Height:** H_max = (u^2 * sin^2(theta)) / (2g)
- **Horizontal Range:** R = (u^2 * sin(2*theta)) / g (Maximized at theta = 45 degrees).

## 2. Rotational Mechanics
- Angular velocity: omega = d(theta)/dt; Angular acceleration: alpha = d(omega)/dt.
- **Torque:** tau = r x F = I * alpha.
- **Moment of Inertia (I):** Sum(m_i * r_i^2).
  - Ring (axis perpendicular): I = M*R^2
  - Disc (central axis): I = (1/2)*M*R^2
  - Solid Sphere: I = (2/5)*M*R^2
- **Angular Momentum:** L = r x p = I * omega. Conserved when external torque is zero.

## 3. Thermodynamics
- **Zeroth Law:** Establishes temperature as a state function.
- **First Law (Conservation of Energy):** dQ = dU + dW (where dW = P*dV for quasi-static process).
- **Thermodynamic Processes:**
  - Isothermal: Constant Temperature (dT = 0 => dU = 0 => dQ = dW).
  - Adiabatic: Zero Heat Exchange (dQ = 0 => dU = -dW; P*V^gamma = constant).
  - Isobaric: Constant Pressure (P = const).
  - Isochoric: Constant Volume (dV = 0 => dW = 0 => dQ = dU).
- **Second Law:** Heat cannot spontaneously flow from cold body to hot body without external work (Clausius & Kelvin-Planck statements).`
  },
  {
    id: 'c11_chem_atomic_structure_bonding',
    classNum: 11,
    subject: 'Chemistry',
    title: 'Atomic Structure & Chemical Bonding',
    summary: 'Bohr model, de Broglie relation, quantum numbers, electronic configuration principles, hybridization, and VSEPR theory.',
    content: `# Class 11: Chemistry - Atomic Structure & Chemical Bonding

## 1. Quantum Mechanical Model of Atom
- **de Broglie Wavelength:** lambda = h / (m*v) = h / p.
- **Heisenberg's Uncertainty Principle:** Delta(x) * Delta(p) >= h / (4*pi).
- **Quantum Numbers:**
  1. *Principal (n):* Shell number, main energy level (1, 2, 3...).
  2. *Azimuthal (l):* Subshell shape (0 to n-1: 0=s, 1=p, 2=d, 3=f).
  3. *Magnetic (m_l):* Spatial orientation (-l to +l).
  4. *Spin (m_s):* Electron spin (+1/2 or -1/2).
- **Filling Rules:**
  - *Aufbau Principle:* Orbitals filled in order of increasing energy (n + l rule).
  - *Pauli Exclusion Principle:* No two electrons in an atom can have all four quantum numbers identical.
  - *Hund's Rule of Maximum Multiplicity:* Electrons pair only after all degenerate orbitals are singly occupied with parallel spins.

## 2. Chemical Bonding & Molecular Structure
- **VSEPR Theory:** Geometry determined by repulsions: (Lone Pair - Lone Pair) > (Lone Pair - Bond Pair) > (Bond Pair - Bond Pair).
- **Hybridization Schemes:**
  - sp: Linear geometry (180 deg, e.g., BeCl2, C2H2).
  - sp^2: Trigonal Planar (120 deg, e.g., BF3, C2H4).
  - sp^3: Tetrahedral (109.5 deg, e.g., CH4; NH3 has pyramid with 107 deg; H2O is bent with 104.5 deg).
  - sp^3d: Trigonal Bipyramidal (e.g., PCl5).
  - sp^3d^2: Octahedral (e.g., SF6).
- **Molecular Orbital Theory (MOT):**
  - Bond Order = (1/2) * [N_b - N_a].
  - If Bond Order > 0, molecule is stable. Diamagnetic if all paired; Paramagnetic if unpaired electrons exist.`
  },
  {
    id: 'c11_math_calculus_sets',
    classNum: 11,
    subject: 'Mathematics',
    title: 'Sets, Relations, Functions & Differential Limits',
    summary: 'Set operations, Cartesian products, domain & range, standard limits, and first principles differentiation.',
    content: `# Class 11: Mathematics - Sets, Functions & Introduction to Limits

## 1. Set Theory & Relations
- Union (A U B), Intersection (A cap B), Difference (A - B), Complement (A').
- **De Morgan's Laws:**
  - (A U B)' = A' cap B'
  - (A cap B)' = A' U B'
- **Cartesian Product:** A x B = {(a, b) : a in A, b in B}.
- **Relation:** Any subset of A x B. A function is a relation where each input has exactly one output.

## 2. Limits and Continuity
- **Standard Limits:**
  - lim (x -> 0) [sin(x) / x] = 1 (where x is in radians).
  - lim (x -> 0) [tan(x) / x] = 1.
  - lim (x -> a) [(x^n - a^n) / (x - a)] = n * a^(n - 1).
  - lim (x -> 0) [(e^x - 1) / x] = 1.
  - lim (x -> 0) [ln(1 + x) / x] = 1.

## 3. Derivative from First Principles
f'(x) = lim (h -> 0) [ (f(x + h) - f(x)) / h ]
- **Elementary Derivatives:**
  - d/dx [x^n] = n * x^(n - 1)
  - d/dx [sin x] = cos x
  - d/dx [cos x] = -sin x
  - d/dx [tan x] = sec^2 x
  - d/dx [e^x] = e^x
  - d/dx [ln x] = 1/x`
  },

  // Class 12
  {
    id: 'c12_phy_electromagnetism_optics',
    classNum: 12,
    subject: 'Physics',
    title: 'Electromagnetism, Wave Optics & Modern Physics',
    summary: 'Coulomb\'s law, Gauss\'s theorem, Biot-Savart law, Faraday\'s induction, interference, and photoelectric effect.',
    content: `# Class 12: Physics - Electromagnetism, Optics & Modern Physics

## 1. Electrostatics & Gauss's Law
- **Coulomb's Law:** F = (1 / 4*pi*epsilon_0) * (q1 * q2 / r^2).
- **Gauss's Theorem:** Total electric flux through closed surface = q_enclosed / epsilon_0.
- **Capacitance:** C = Q / V.
  - Parallel plate: C = (epsilon_0 * A) / d (multiplied by dielectric constant K when filled).

## 2. Magnetism & Electromagnetic Induction
- **Biot-Savart Law:** dB = (mu_0 / 4*pi) * (I * dl x r) / r^3.
- **Ampere's Circuital Law:** Line integral of B around closed loop = mu_0 * I_enclosed.
- **Faraday's Law of Induction:** Induced EMF: e = -d(Phi_B) / dt. Negative sign denotes Lenz's Law (conservation of energy).

## 3. Wave Optics & Interference
- **Huygens' Principle:** Every point on a wavefront acts as secondary source of wavelets.
- **Young's Double Slit Experiment (YDSE):**
  - Constructive interference (bright fringe): Path difference = n * lambda.
  - Destructive interference (dark fringe): Path difference = (2n - 1) * (lambda / 2).
  - Fringe width: beta = (lambda * D) / d.

## 4. Modern Physics: Photoelectric Effect
- Einstein's Photoelectric Equation:
  **h*nu = Phi_0 + K_max = h*nu_0 + (1/2)*m*v_max^2**
  *(where h is Planck's constant, nu is photon frequency, Phi_0 is work function, nu_0 is threshold frequency)*
- Photons possess energy E = h*nu and momentum p = h/lambda.`
  },
  {
    id: 'c12_chem_organic_electro',
    classNum: 12,
    subject: 'Chemistry',
    title: 'Electrochemistry, Kinetics & Organic Reaction Mechanisms',
    summary: 'Nernst equation, rate laws & Arrhenius equation, SN1 vs SN2 mechanisms, and named reactions in aldehydes/ketones.',
    content: `# Class 12: Chemistry - Physical & Organic Chemistry Master Notes

## 1. Electrochemistry
- **Nernst Equation (at 298 K):**
  E_cell = E_cell_standard - (0.0591 / n) * log10(Q)
- **Gibbs Free Energy and EMF:** Delta_G = -n * F * E_cell.
- **Kohlrausch's Law:** Molar conductivity at infinite dilution = sum of individual ionic molar conductivities.

## 2. Chemical Kinetics
- **Zero-Order Reaction:** Rate = k; [A] = [A]_0 - kt; Half-life t_1/2 = [A]_0 / (2k).
- **First-Order Reaction:** Rate = k[A]; k = (2.303 / t) * log10([A]_0 / [A]); Half-life t_1/2 = 0.693 / k (independent of initial concentration!).
- **Arrhenius Equation:** k = A * exp(-E_a / (RT)).

## 3. Organic Chemistry: Nucleophilic Substitution
- **SN1 Mechanism (Two-step):**
  - Unimolecular rate-determining step: Carbocation intermediate formed.
  - Reactivity order: Tertiary (3 deg) > Secondary (2 deg) > Primary (1 deg).
  - Product undergoes racemization.
- **SN2 Mechanism (One-step concerted):**
  - Bimolecular transition state: Backside nucleophilic attack.
  - Reactivity order: Methyl > Primary (1 deg) > Secondary (2 deg) > Tertiary (3 deg).
  - Complete Walden inversion of configuration.

## 4. Named Organic Reactions:
- **Aldol Condensation:** Carbonyl compounds with alpha-hydrogen reacting with dilute base.
- **Cannizzaro Reaction:** Aldehydes lacking alpha-hydrogen undergo disproportionation in conc. alkali.
- **Gabriel Phthalimide Synthesis:** Prepares pure aliphatic primary amines.`
  },
  {
    id: 'c12_math_calculus_integration_matrices',
    classNum: 12,
    subject: 'Mathematics',
    title: 'Integral Calculus, Differential Equations & Matrices',
    summary: 'Definite integrals properties, integration by parts, order & degree of differential equations, and matrix inverse methods.',
    content: `# Class 12: Mathematics - Advanced Calculus & Linear Algebra

## 1. Matrices and Determinants
- Determinant of order 2: |a b; c d| = ad - bc.
- Inverse of a Matrix: A^(-1) = (1 / |A|) * adj(A), valid if and only if |A| != 0 (non-singular).
- System of Linear Equations: AX = B => X = A^(-1) * B.

## 2. Methods of Integration
- **Integration by Substitution:** int [f(g(x)) * g'(x) dx] = int [f(u) du].
- **Integration by Parts (ILATE rule):**
  int [u * v dx] = u * int[v dx] - int [ (du/dx) * int[v dx] ] dx
  *(Order: Inverse, Logarithmic, Algebraic, Trigonometric, Exponential)*
- **Definite Integral Key Properties:**
  1. int_a^b f(x) dx = int_a^b f(t) dt
  2. int_a^b f(x) dx = - int_b^a f(x) dx
  3. int_0^a f(x) dx = int_0^a f(a - x) dx  [King's Property]
  4. int_(-a)^a f(x) dx = 2 * int_0^a f(x) dx if f(x) is even [f(-x) = f(x)], and 0 if f(x) is odd [f(-x) = -f(x)].

## 3. Differential Equations
- **Order:** Highest order derivative present in equation.
- **Degree:** Power of the highest order derivative after making it polynomial in derivatives.
- **Linear Differential Equation (First Order):**
  dy/dx + P(x)*y = Q(x)
  - Integrating Factor (I.F.) = exp( int P(x) dx )
  - General Solution: y * (I.F.) = int [ Q(x) * (I.F.) dx ] + C.`
  }
];

const outPath = path.join(__dirname, 'public', 'data', 'curriculum-notes.json');
fs.writeFileSync(outPath, JSON.stringify(curriculum, null, 2), 'utf8');
console.log(`Generated ${curriculum.length} curriculum notes for classes 5 to 12 at ${outPath}`);
