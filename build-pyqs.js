// build-pyqs.js
// Generates Previous Year Questions (PYQs) for Classes 9, 10, 11, and 12 across all key subjects.
const fs = require('fs');
const path = require('path');

const pyqs = [
  // ===================== CLASS 9 =====================
  {
    id: 'pyq_c9_sci_2023',
    classNum: 9,
    subject: 'Science',
    year: '2023',
    exam: 'Annual Examination',
    title: 'Science Board-Pattern Annual Paper',
    description: 'Covers Force & Laws of Motion, Structure of the Atom, Gravitation, and Plant Tissues.',
    questions: [
      {
        qNum: 1,
        marks: 1,
        question: 'State Newton\'s first law of motion. Why is it also referred to as the law of inertia?',
        solution: 'Newton\'s first law states that an object remains in a state of rest or of uniform motion in a straight line unless compelled to change that state by an applied external force. Inertia is the inherent property of an object to resist changes in its state of motion.'
      },
      {
        qNum: 2,
        marks: 2,
        question: 'Differentiate between mass and weight. What will be the weight of a 60 kg object on the moon (g_moon = 1/6 g_earth)?',
        solution: 'Mass is the quantity of matter contained in a body and remains constant everywhere (scalar). Weight is the force of gravitational pull on the mass: W = m * g (vector). Weight on Earth = 60 * 9.8 = 588 N. Weight on Moon = 588 / 6 = 98 N.'
      },
      {
        qNum: 3,
        marks: 3,
        question: 'A car accelerates uniformly from 18 km/h to 72 km/h in 5 seconds. Calculate (i) the acceleration, and (ii) the distance covered during this interval.',
        solution: 'Initial velocity u = 18 * (5/18) = 5 m/s. Final velocity v = 72 * (5/18) = 20 m/s. Time t = 5 s. (i) Acceleration a = (v - u)/t = (20 - 5)/5 = 3 m/s^2. (ii) Distance s = ut + 0.5*a*t^2 = 5*5 + 0.5*3*(25) = 25 + 37.5 = 62.5 meters.'
      },
      {
        qNum: 4,
        marks: 5,
        question: '(a) State the postulates of Dalton\'s atomic theory. (b) Explain Rutherford\'s alpha-particle scattering experiment and why it led to the discovery of the nucleus.',
        solution: '(a) All matter is made of indivisible atoms; atoms of a given element are identical in mass and properties; compounds form when atoms combine in whole number ratios. (b) Alpha particles were bombarded on thin gold foil. Most passed undeflected (most space is empty), few deflected by small angles, and 1 in 12,000 rebounded by 180 deg, showing that all positive charge and mass is concentrated in a tiny central core (nucleus).'
      }
    ]
  },
  {
    id: 'pyq_c9_math_2023',
    classNum: 9,
    subject: 'Mathematics',
    year: '2023',
    exam: 'Annual Examination',
    title: 'Mathematics Final Term Paper',
    description: 'Polynomials, Coordinate Geometry, Heron\'s Formula, and Circles.',
    questions: [
      {
        qNum: 1,
        marks: 2,
        question: 'Find the value of k if (x - 1) is a factor of polynomial p(x) = 2x^2 + kx + sqrt(2).',
        solution: 'By Factor Theorem, if (x - 1) is a factor, then p(1) = 0. => 2(1)^2 + k(1) + sqrt(2) = 0 => 2 + k + sqrt(2) = 0 => k = -(2 + sqrt(2)).'
      },
      {
        qNum: 2,
        marks: 3,
        question: 'Find the area of a triangular park whose sides are 50 m, 65 m, and 65 m using Heron\'s formula.',
        solution: 'Semi-perimeter s = (a + b + c)/2 = (50 + 65 + 65)/2 = 180/2 = 90 m. Area = sqrt[s(s - a)(s - b)(s - c)] = sqrt[90 * (90 - 50) * (90 - 65) * (90 - 65)] = sqrt[90 * 40 * 25 * 25] = sqrt[3600 * 625] = 60 * 25 = 1500 m^2.'
      },
      {
        qNum: 3,
        marks: 5,
        question: 'Prove that the angle subtended by an arc at the center is double the angle subtended by it at any point on the remaining part of the circle.',
        solution: 'Given a circle with center O and arc PQ subtending angle POQ at center and angle PAQ at circle. Construct line segment AO extended to B. In triangle OAP, OA = OP (radii), so angle OPA = angle OAP. Exterior angle POB = angle OAP + angle OPA = 2 * angle OAP. Similarly, exterior angle QOB = 2 * angle OAQ. Adding both yields angle POQ = 2 * (angle OAP + angle OAQ) = 2 * angle PAQ. Hence proved.'
      }
    ]
  },

  // ===================== CLASS 10 =====================
  {
    id: 'pyq_c10_sci_2023',
    classNum: 10,
    subject: 'Science',
    year: '2023',
    exam: 'CBSE Board Examination',
    title: 'Class 10 CBSE Board Science Paper',
    description: 'Electric Circuits, Light Reflection & Refraction, Carbon Compounds, and Heredity.',
    questions: [
      {
        qNum: 1,
        marks: 2,
        question: 'Why does dry HCl gas not change the colour of dry litmus paper, whereas aqueous hydrochloric acid does?',
        solution: 'Acids exhibit acidic behavior solely due to the presence of hydronium ions H3O+ (or H+ ions). Dry HCl gas cannot dissociate into ions without water. In aqueous solution, HCl + H2O -> H3O+ + Cl-, which turns blue litmus paper red.'
      },
      {
        qNum: 2,
        marks: 3,
        question: 'An electric heater rated 1500 W operates for 2 hours daily. Calculate the electrical energy consumed in kWh in a 30-day month, and the total cost at Rs 6 per unit.',
        solution: 'Power P = 1500 W = 1.5 kW. Daily time t = 2 hours. Monthly energy = 1.5 kW * 2 h/day * 30 days = 90 kWh (units). Total cost = 90 units * Rs 6/unit = Rs 540.'
      },
      {
        qNum: 3,
        marks: 3,
        question: 'Draw a ray diagram showing the formation of an image by a concave mirror when an object is placed between the Focus (F) and the Center of Curvature (C). State the image characteristics.',
        solution: 'Ray diagram: Ray parallel to principal axis reflects through F; ray passing through F reflects parallel. The two rays intersect beyond C. Characteristics: (1) Position: Beyond C, (2) Nature: Real and Inverted, (3) Size: Enlarged / Magnified.'
      },
      {
        qNum: 4,
        marks: 5,
        question: '(a) What is homologous series? Give two examples of alkane series. (b) Explain saponification reaction with chemical equation.',
        solution: '(a) A homologous series is a group of organic compounds having the same functional group and similar chemical properties in which successive members differ by a -CH2- unit and 14 u in molecular mass. Examples: Methane (CH4), Ethane (C2H6). (b) Saponification is the alkaline hydrolysis of an ester: Ethyl ethanoate + Sodium hydroxide -> Sodium ethanoate + Ethanol: CH3COOC2H5 + NaOH -> CH3COONa + C2H5OH.'
      }
    ]
  },
  {
    id: 'pyq_c10_math_2023',
    classNum: 10,
    subject: 'Mathematics',
    year: '2023',
    exam: 'CBSE Board Examination',
    title: 'Class 10 CBSE Board Mathematics Standard Paper',
    description: 'Arithmetic Progressions, Trigonometry Applications, Circles, and Surface Areas.',
    questions: [
      {
        qNum: 1,
        marks: 2,
        question: 'Find the 20th term from the end of the arithmetic progression (AP): 3, 8, 13, ..., 253.',
        solution: 'Reverse the AP: First term a = 253, common difference d = 3 - 8 = -5. nth term formula: a_n = a + (n - 1)d. For n = 20: a_20 = 253 + (20 - 1)*(-5) = 253 - 95 = 158.'
      },
      {
        qNum: 2,
        marks: 3,
        question: 'Prove the trigonometric identity: (sin theta - 2*sin^3 theta) / (2*cos^3 theta - cos theta) = tan theta.',
        solution: 'LHS = [sin theta * (1 - 2*sin^2 theta)] / [cos theta * (2*cos^2 theta - 1)]. Note that 1 - 2*sin^2 theta = cos(2*theta) and 2*cos^2 theta - 1 = cos(2*theta). Therefore, LHS = [sin theta * cos(2*theta)] / [cos theta * cos(2*theta)] = sin theta / cos theta = tan theta = RHS. Hence proved.'
      },
      {
        qNum: 3,
        marks: 5,
        question: 'From the top of a 7 m high building, the angle of elevation of the top of a cable tower is 60 degrees and the angle of depression of its foot is 45 degrees. Determine the height of the tower.',
        solution: 'Let building AB = 7 m and tower CD with height h. Let horizontal distance between them be x. In right triangle ABD: tan(45) = AB/x => 1 = 7/x => x = 7 m. Let tower be divided into CE and ED where ED = AB = 7 m. In right triangle AEC: tan(60) = CE/x => sqrt(3) = CE/7 => CE = 7*sqrt(3) m. Total height of tower h = CE + ED = 7*sqrt(3) + 7 = 7*(sqrt(3) + 1) m (approx 19.12 m).'
      }
    ]
  },

  // ===================== CLASS 11 =====================
  {
    id: 'pyq_c11_phy_2023',
    classNum: 11,
    subject: 'Physics',
    year: '2023',
    exam: 'Annual Examination',
    title: 'Class 11 Physics Annual Board-Pattern Paper',
    description: 'Work-Energy Theorem, Projectile Motion, Bernoulli\'s Theorem, and SHM.',
    questions: [
      {
        qNum: 1,
        marks: 2,
        question: 'State work-energy theorem for a variable force.',
        solution: 'The work-energy theorem states that the net work done by all external forces acting on a particle equals the change in its kinetic energy: W = Delta K = K_final - K_initial. Mathematically, W = integral(F dx) = integral(m * v * dv) = (1/2)*m*v^2 - (1/2)*m*u^2.'
      },
      {
        qNum: 2,
        marks: 3,
        question: 'Derive an expression for the terminal velocity of a small spherical ball of radius r falling through a viscous fluid of viscosity eta and density sigma.',
        solution: 'Forces acting on falling sphere of density rho: (1) Downward gravity: F_g = (4/3)*pi*r^3 * rho * g. (2) Upward buoyant force: F_b = (4/3)*pi*r^3 * sigma * g. (3) Upward Stokes viscous drag: F_v = 6*pi*eta*r*v. At terminal velocity v_t, net force = 0 => F_g = F_b + F_v. Solving yields: v_t = [2 * r^2 * (rho - sigma) * g] / [9 * eta].'
      },
      {
        qNum: 3,
        marks: 5,
        question: '(a) State and prove Bernoulli\'s theorem for non-viscous streamline fluid flow. (b) Give one practical application of Bernoulli\'s principle.',
        solution: '(a) For streamline, steady, incompressible, and non-viscous flow, the total energy per unit mass (pressure energy + kinetic energy + potential energy) is constant along a streamline: P + (1/2)*rho*v^2 + rho*g*h = constant. (b) Aerodynamic lift on aircraft wings (airfoil design causes faster airspeed over curved top lowering pressure relative to bottom).'
      }
    ]
  },
  {
    id: 'pyq_c11_chem_2023',
    classNum: 11,
    subject: 'Chemistry',
    year: '2023',
    exam: 'Annual Examination',
    title: 'Class 11 Chemistry Annual Paper',
    description: 'Thermodynamics, Chemical Equilibrium, Redox Reactions, and Hydrocarbons.',
    questions: [
      {
        qNum: 1,
        marks: 2,
        question: 'State Le Chatelier\'s principle. Predict the effect of increasing pressure on the equilibrium: N2(g) + 3H2(g) <=> 2NH3(g) (Delta H = -92 kJ).',
        solution: 'Le Chatelier\'s principle states that if a system at dynamic equilibrium is subjected to a change in concentration, temperature, or pressure, the system will adjust itself in such a direction as to counteract the effect of that change. Increasing pressure shifts equilibrium towards fewer gas moles (forward reaction: 4 moles -> 2 moles), producing more ammonia.'
      },
      {
        qNum: 2,
        marks: 3,
        question: 'Calculate the standard enthalpy of formation of CH4(g) given: Enthalpy of combustion of C(s) = -393.5 kJ/mol, H2(g) = -285.8 kJ/mol, and CH4(g) = -890.3 kJ/mol.',
        solution: 'Reaction: C(s) + 2H2(g) -> CH4(g). Delta H_f = Delta H_c(C) + 2*Delta H_c(H2) - Delta H_c(CH4) = (-393.5) + 2*(-285.8) - (-890.3) = -393.5 - 571.6 + 890.3 = -74.8 kJ/mol.'
      },
      {
        qNum: 3,
        marks: 5,
        question: '(a) Explain Markovnikov\'s rule with an example of addition of HBr to propene. (b) State why anti-Markovnikov addition occurs in presence of peroxides (Kharasch effect).',
        solution: '(a) Markovnikov\'s rule states that during electrophilic addition of unsymmetrical reagent (H-X) to an unsymmetrical alkene, the negative part adds to the carbon possessing fewer hydrogen atoms. CH3-CH=CH2 + HBr -> CH3-CH(Br)-CH3 (2-bromopropane major). (b) In the presence of organic peroxides, addition proceeds via a free radical mechanism where bromine radical attacks first to generate the more stable secondary free radical intermediate.'
      }
    ]
  },

  // ===================== CLASS 12 =====================
  {
    id: 'pyq_c12_phy_2023',
    classNum: 12,
    subject: 'Physics',
    year: '2023',
    exam: 'CBSE Board Examination',
    title: 'Class 12 CBSE Board Physics Question Paper',
    description: 'Electric Charges & Fields, Moving Charges, Wave Optics, and Semiconductor Electronics.',
    questions: [
      {
        qNum: 1,
        marks: 2,
        question: 'Two point charges +4q and +q are placed at a distance r apart. Where should a third charge Q be placed on the line joining them so that the entire system is in equilibrium?',
        solution: 'Let Q be placed at distance x from +4q. For force on Q to be zero: k*(4q)*Q / x^2 = k*q*Q / (r - x)^2 => 4 / x^2 = 1 / (r - x)^2 => 2 / x = 1 / (r - x) => 2r - 2x = x => 3x = 2r => x = 2r / 3. For +q to be in equilibrium: k*q*(4q)/r^2 + k*q*Q/(r/3)^2 = 0 => 4q/r^2 + 9Q/r^2 = 0 => Q = -4q / 9.'
      },
      {
        qNum: 2,
        marks: 3,
        question: 'Derive the expression for the magnetic field at the center of a circular current-carrying coil of radius R having N turns using Biot-Savart Law.',
        solution: 'By Biot-Savart law for an element dl: dB = (mu_0 / 4*pi) * (I * dl * sin(90)) / R^2 = (mu_0 * I * dl) / (4*pi*R^2). Integrating around circle: sum of dl = 2*pi*R. Total B for 1 turn = (mu_0 * I * 2*pi*R) / (4*pi*R^2) = (mu_0 * I) / (2*R). For N turns: B = (mu_0 * N * I) / (2*R).'
      },
      {
        qNum: 3,
        marks: 5,
        question: '(a) Draw circuit diagram of a full-wave rectifier using two p-n junction diodes and explain its working with input-output waveforms. (b) What is the function of a capacitor filter in this circuit?',
        solution: '(a) Center-tapped transformer with two diodes D1 and D2 connected to load resistor R_L. During positive half cycle of AC, D1 is forward biased (conducts) while D2 is reverse biased (blocks). During negative half cycle, D2 conducts while D1 blocks. Current through R_L flows in the same direction in both cycles producing unidirectional pulsating DC. (b) A capacitor filter connected in parallel with load discharges slowly between peaks, smoothing output ripples into steady DC.'
      }
    ]
  },
  {
    id: 'pyq_c12_chem_2023',
    classNum: 12,
    subject: 'Chemistry',
    year: '2023',
    exam: 'CBSE Board Examination',
    title: 'Class 12 CBSE Board Chemistry Question Paper',
    description: 'Solutions & Colligative Properties, Coordination Chemistry, and Aldehydes & Ketones.',
    questions: [
      {
        qNum: 1,
        marks: 2,
        question: 'State Henry\'s law. Mention one biological application of Henry\'s law related to scuba divers.',
        solution: 'Henry\'s law states that at a constant temperature, the solubility of a gas in a liquid is directly proportional to the partial pressure of the gas above the liquid (p = K_H * x). Deep scuba divers breathe air at high pressure, causing nitrogen to dissolve in blood. Rapid ascent causes nitrogen bubbles to form in capillaries, causing the painful condition known as "the bends". Diluting diving tanks with Helium prevents this.'
      },
      {
        qNum: 2,
        marks: 3,
        question: 'Using Crystal Field Theory (CFT), explain why [Co(NH3)6]3+ is a low-spin diamagnetic complex while [CoF6]3- is a high-spin paramagnetic complex.',
        solution: 'Co3+ has electronic configuration 3d^6. NH3 is a strong field ligand, producing large crystal field splitting Delta_o > P (pairing energy). All 6 electrons pair up in lower t_2g orbitals (t_2g^6 e_g^0) with zero unpaired electrons -> diamagnetic low-spin. In contrast, F- is a weak field ligand, so Delta_o < P. Electrons occupy both levels (t_2g^4 e_g^2) leaving 4 unpaired electrons -> paramagnetic high-spin.'
      },
      {
        qNum: 3,
        marks: 5,
        question: 'An organic compound [A] with formula C8H8O gives positive 2,4-DNP test and haloform test. It does not reduce Tollens reagent. On vigorous oxidation with chromic acid, it gives benzoic acid [B]. Identify [A] and write the chemical reactions.',
        solution: '(1) Positive 2,4-DNP indicates carbonyl group. (2) Fails Tollens test -> compound is a ketone, not an aldehyde. (3) Positive iodoform test shows presence of methyl ketone group (CH3-C=O). (4) Formula C8H8O minus CH3CO leaves C6H5 (phenyl group). Hence, compound [A] is Acetophenone (C6H5COCH3). Reactions: (i) C6H5COCH3 + I2 + NaOH -> CHI3 (yellow ppt) + C6H5COONa; (ii) Oxidation with K2Cr2O7/H2SO4 yields Benzoic acid (C6H5COOH) [B].'
      }
    ]
  },
  {
    id: 'pyq_c12_math_2023',
    classNum: 12,
    subject: 'Mathematics',
    year: '2023',
    exam: 'CBSE Board Examination',
    title: 'Class 12 CBSE Board Mathematics Question Paper',
    description: 'Definite Integrals, Vectors & 3D Geometry, and Probability Distributions.',
    questions: [
      {
        qNum: 1,
        marks: 2,
        question: 'Find the unit vector perpendicular to both vectors a = 2i + j + 2k and b = j + k.',
        solution: 'Cross product a x b = det[i j k; 2 1 2; 0 1 1] = i(1 - 2) - j(2 - 0) + k(2 - 0) = -i - 2j + 2k. Magnitude |a x b| = sqrt((-1)^2 + (-2)^2 + 2^2) = sqrt(1 + 4 + 4) = 3. Unit vector = (a x b) / |a x b| = (-1/3)i - (2/3)j + (2/3)k.'
      },
      {
        qNum: 2,
        marks: 3,
        question: 'Evaluate the definite integral: I = integral from 0 to pi/2 of [ sqrt(sin x) / (sqrt(sin x) + sqrt(cos x)) ] dx.',
        solution: 'Let I = int_0^(pi/2) [sqrt(sin x) / (sqrt(sin x) + sqrt(cos x))] dx  --- (1). By King\'s property int_0^a f(x) dx = int_0^a f(a - x) dx: I = int_0^(pi/2) [sqrt(sin(pi/2 - x)) / (sqrt(sin(pi/2 - x)) + sqrt(cos(pi/2 - x)))] dx = int_0^(pi/2) [sqrt(cos x) / (sqrt(cos x) + sqrt(sin x))] dx  --- (2). Adding (1) and (2): 2*I = int_0^(pi/2) 1 dx = [x]_0^(pi/2) = pi/2. Hence, I = pi/4.'
      },
      {
        qNum: 3,
        marks: 5,
        question: 'In answering a multiple-choice exam question with 4 options, a student either knows the answer or guesses. Probability that student knows the answer is 3/5, and probability of guessing is 2/5. Assuming a student who guesses has probability 1/4 of being correct, what is the probability that the student knew the answer given that the answer was correct?',
        solution: 'Let E1 = student knows answer (P(E1) = 3/5), E2 = student guesses (P(E2) = 2/5). Let A = answer is correct. P(A|E1) = 1 (if known, answered correctly), P(A|E2) = 1/4. By Bayes\' Theorem: P(E1|A) = [P(E1)*P(A|E1)] / [P(E1)*P(A|E1) + P(E2)*P(A|E2)] = [(3/5)*1] / [(3/5)*1 + (2/5)*(1/4)] = (3/5) / (3/5 + 2/20) = (12/20) / (12/20 + 2/20) = 12 / 14 = 6/7.'
      }
    ]
  }
];

const outPath = path.join(__dirname, 'public', 'data', 'pyqs.json');
fs.writeFileSync(outPath, JSON.stringify(pyqs, null, 2), 'utf8');
console.log(`Generated ${pyqs.length} PYQ papers for classes 9 to 12 at ${outPath}`);
