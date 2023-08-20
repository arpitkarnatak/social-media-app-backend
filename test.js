const keccak256 = require("keccak256");

const MAX_PLANETS = 3;

// struct AIBOLTData {
//     string sun;
//     string sunSvg;
//     uint256 numPlanets;
//     Planet[MAX_PLANETS] planets;
// }

// struct Planet {
//     OrbitSpeed orbitSpeed;
//     PlanetSize size;
//     string theme;
//     string svg;
// }

const OrbitSpeed = ["Crawl", "Cruise", "Dash"];

const PlanetSize = ["Speck", "Globe", "Titan"];

function encodePacked(...args) {
  return Buffer.concat(
    args.map((arg) => {
      if (typeof arg === "number" || typeof arg === "bigint") {
        // Encode integers as 32-byte (256-bit) buffers
        return Buffer.from(arg.toString(16).padStart(64, "0"), "hex");
      } else if (typeof arg === "string") {
        // Encode strings as UTF-8
        return Buffer.from(arg, "utf-8");
      } else {
        throw new Error("Unsupported type for encodePacked");
      }
    })
  );
}

function toUint256(buffer) {
  return BigInt("0x" + buffer.toString("hex"));
}

function generateAIORBITTraits(tokenId) {
  let hue = toUint256(keccak256(encodePacked(tokenId, "hue"))) % BigInt(360);
  let rotationSpeed =
    (toUint256(keccak256(encodePacked(tokenId, "rotationSpeed"))) %
      BigInt(11)) +
    BigInt(5);
  let numCircles =
    (toUint256(keccak256(encodePacked(tokenId, "numCircles"))) % BigInt(3)) +
    BigInt(3);

  let radius = new Array(Number(numCircles));
  let distance = new Array(Number(numCircles));
  let strokeWidth = new Array(Number(numCircles));

  for (let i = 0; i < numCircles; i++) {
    radius[i] =
      (toUint256(keccak256(encodePacked(tokenId, "radius", BigInt(i)))) %
        BigInt(40)) +
      BigInt(20);
    distance[i] =
      (toUint256(keccak256(encodePacked(tokenId, "distance", BigInt(i)))) %
        BigInt(80)) +
      BigInt(40);
    strokeWidth[i] =
      (toUint256(keccak256(encodePacked(tokenId, "strokeWidth", BigInt(i)))) %
        BigInt(16)) +
      BigInt(5);
  }

  return {
    hue: Number(hue),
    rotationSpeed: Number(rotationSpeed),
    numCircles: Number(numCircles),
    radius: radius.map(Number),
    distance: distance.map(Number),
    strokeWidth: strokeWidth.map(Number),
  };

  //return [Number(hue), Number(rotationSpeed), Number(numCircles), ...radius.map(Number), ...distance.map(Number), ...strokeWidth.map(Number)]
}

function generatePlanetData(averagedValues, numPlanets, planetBiomes) {
  let planets = Array(numPlanets).fill({});

  // Set range for rotationSpeed
  let rotationSpeed_start = 5;
  let rotationSpeed_end = 15;

  // Set range for orbitSpeed
  let orbitSpeed_start = 0;
  let orbitSpeed_end = 2;

  for (let i = 0; i < numPlanets; i++) {
    // Scale rotationSpeed to orbitSpeed
    let orbitSpeed =
      ((averagedValues.rotationSpeed - rotationSpeed_start) *
        (orbitSpeed_end - orbitSpeed_start)) /
        (rotationSpeed_end - rotationSpeed_start) +
      orbitSpeed_start;

    // Ensure orbitSpeed is within valid range
    orbitSpeed =
      orbitSpeed > orbitSpeed_end
        ? orbitSpeed_end
        : orbitSpeed < orbitSpeed_start
        ? orbitSpeed_start
        : orbitSpeed;

    let size = PlanetSize[Math.floor(averagedValues.radius[i] % numPlanets)];
    let theme = [
      "Habitable",
      "Gas-Giant",
      "Ice-Giant",
      "Artificial",
      "Terraformed",
    ][Math.floor(planetBiomes[i])];

    planets[i] = {
      speed: OrbitSpeed[Math.floor(orbitSpeed % 3)],
      size: size,
      theme: theme,
      something: "",
    };
  }
  return planets;
}

function generateAIBOLTData(_tokenIds) {
  let totalHue = 0;
  let totalRotationSpeed = 0;
  let totalNumCircles = 0;
  let totalRadius = [0, 0, 0, 0, 0];
  let totalDistance = [0, 0, 0, 0, 0];
  let totalStrokeWidth = [0, 0, 0, 0, 0];

  for (let j = 0; j < 5; j++) {
    let commonValues = generateAIORBITTraits(_tokenIds[j]);
    //console.log("Orbit", j, commonValues);
    totalHue += commonValues.hue;
    totalRotationSpeed += commonValues.rotationSpeed;
    totalNumCircles += commonValues.numCircles;
    for (let i = 0; i < commonValues.numCircles; i++) {
      totalRadius[i] = totalRadius[i] + commonValues.radius[i];
      totalDistance[i] = totalDistance[i] + commonValues.distance[i];
      totalStrokeWidth[i] = totalStrokeWidth[i] + commonValues.strokeWidth[i];
    }
  }

  let averagedValues = {
    hue: totalHue / 5,
    rotationSpeed: totalRotationSpeed / 5,
    numCircles: totalNumCircles / 5,
    radius: [],
    distance: [],
    strokeWidth: [],
  };

  for (let i = 0; i < averagedValues.numCircles; i++) {
    averagedValues.radius[i] = totalRadius[i] / 5;
    averagedValues.distance[i] = totalDistance[i] / 5;
    averagedValues.strokeWidth[i] = totalStrokeWidth[i] / 5;
  }

  //console.log("AV", averagedValues);

  let numPlanets = 0;

  if (averagedValues.numCircles >= 1 && averagedValues.numCircles <= 3) {
    numPlanets = 1;
  } else if (averagedValues.numCircles > 3 && averagedValues.numCircles <= 4) {
    numPlanets = 2;
  } else if (averagedValues.numCircles > 4 && averagedValues.numCircles <= 5) {
    numPlanets = 3;
  }

  let planetBiomes = [0, 0, 0, 0, 0];

  // Set range for hue
  let hue_start = 0;
  let hue_end = 359;

  // // Set range for planetBiomes
  let biome_start = 0;
  let biome_end = 5;

  for (let i = 0; i < 3; i++) {
    // Add an offset to the hue for each planet
    let hue = (averagedValues.hue + i * 60) % 360;

    // Scale hue to biome
    let biome =
      ((hue - hue_start) * (biome_end - biome_start)) / (hue_end - hue_start) +
      biome_start;

    // Ensure biome is within valid range and convert it to an integer
    planetBiomes[i] =
      biome > biome_end
        ? biome_end
        : biome < biome_start
        ? biome_start
        : Number(biome);
  }
  //console.log("Biomes", planetBiomes);

  let planets = generatePlanetData(averagedValues, numPlanets, planetBiomes);
  console.log("Planets", planets);
  // // Default sun values
  let sun = ["Pulsar", "Red-Giant", "White-Dwarf", "Neutron-Star"][
    Math.floor(averagedValues.hue % 4)
  ];

  console.log("Sun", sun);
  // return AIBOLTData(sun, "", numPlanets, planets);
}

// console.log(generateAIORBITTraits(5407));
// console.log("Orbit", generateAIBOLTData([1577, 2780, 5578, 7708, 7904])); // Faulty case

//console.log("Orbit", 1182, generateAIBOLTData([3067, 4766, 5974, 7017, 8374])); // 1182
//console.log(generateAIBOLTData([1140, 1197, 1546, 3982, 9212])); // 1410
//console.log("Orbit", 1196, generateAIBOLTData([1652, 3276, 6755, 8017, 9004])); // 1196 // FAULTY

console.log("Orbit", 1128, generateAIBOLTData([2147, 3765, 5009, 5184, 6980])); //1128

// Array.from(Array(100).keys()).forEach((i) =>
//   console.log(i, generateAIORBITTraits(i))
// );
