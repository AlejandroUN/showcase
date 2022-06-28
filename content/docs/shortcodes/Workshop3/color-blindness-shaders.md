# **Color Blindness Corrector Using Shaders**

## **Problem statement**

People with colour vision deficiency find it difficult to identify and distinguish between certain colours.

Colour vision deficiency is not usually anything to be concerned about.

Most people get used to it over time, it will not normally get any worse, and it's rarely a sign of anything serious.

But it can sometimes cause issues such as:

- Difficulty at school if colours are used to help with learning
- Problems with food, such as identifying whether meat is fully cooked or whether fruit is ripe
- Getting medications confused if they're not clearly labelled
- Trouble identifying safety warnings or signs
- Slightly limited career choices – certain jobs, such as pilots, train drivers, electricians and air traffic controllers, may require accurate colour recognition

## **Background**

#### **Definition**

Color blindness is a _reduced ability to distinguish between color_ when compared to the standard for normal human color vision. When a person is color blind, also called color vision deficiency (CVD), they usually have difficulty distinguishing between certain colors such as yellow and orange, green and brown, pink and gray, or blue and purple.

#### **Types**

- **Red-green** color blindness, which includes protan-type CVD (protanomaly and protanopia) and deutan-type CVD (deuteranomaly and deuteranopia).
- Tritan-type CVD, also called **blue-yellow** color blindness which is associated with the inability to see shades of blue, and confusions between blue and green colors. Blue-yellow color blindness is usually caused by age-related eye conditions such as glaucoma, or exposure to certain chemicals or medical treatments.
- In very rare cases, a person can be completely color blind, meaning they see only the intensity of light, but not its color. This is called **monochromacy** or achromatopsia.

<table>
<tr>
<td><img src="../../../shortcodes/resources/images/normalVision.jpg" alt="Normal Vision"/></td>
<td><img src="../../../shortcodes/resources/images/deutanBlindness.jpg" alt="Deutan-type blindness"/></td>
</tr>
<tr>
<td><img src="../../../shortcodes/resources/images/protanBlindness.jpg" alt="Protan Vision"/></td>
<td><img src="../../../shortcodes/resources/images/monochromacyBlindness.jpg" alt="Deutan-type blindness"/></td>
</tr>
</table>

#### **Solutions**

EnChroma has developed optical lens technology that selectively filters out wavelengths of light at the precise point where the confusion or excessive overlap of color sensitivity occurs. This increases contrast between the red and green color signals, alleviating symptoms of color blindness for a richer experience of the world.

EnChroma color blind glasses are uniquely engineered to give those with color blindness the ability to see a broader spectrum of bright color. Utilizing a patented light filter technique, EnChroma’s lens technology is applied with mathematical precision to address common forms of red-green colorblindness. Although EnChroma glasses are not a cure, they are helpful for approximately 80% of people with color blindness.

There are different algorithms to enable people with color blindness to make it easier to differentiate color spectrums that are difficult for them, such as the LMS Daltonization algorithm, Color-blind Filter Service (CBFS) algorithm, LAB color corrector algorithm, and the shifting color algorithm.

For people with Protanopia or Tritanopia, the LMS algorithm is better than CBFS algorithm as the LMS algorithm only changes color of con-fused areas with no change in the brightness. For people with Deuteranopia, the LAB color correction is better than the LMS algorithm.

#### **The LMS algorithm**

The LMS algorithm in the developed application is implemented for Protanopia, Duteranopia, and Tritanopia. It is the most famous algorithm used for color-blindness correction. Its idea is to use the information lost in the simulation of color blindness and use LMS color space to compensate colors missing in each group/type of cones, long (L), medium (M), and short (S)

1. Convert RGB image to LMS color space using equation

<td><img src="../../../shortcodes/resources/images/LMSalgorithm/1.jpg" alt="First step"/></td>

2. Simulate color-blindness using equation for Protanopia, for Deuteranopia and for Tritanopia

<td><img src="../../../shortcodes/resources/images/LMSalgorithm/2.jpg" alt="Second step"/></td>

3. Convert LMS back to RGB using equation

<td><img src="../../../shortcodes/resources/images/LMSalgorithm/3.jpg" alt="Third step"/></td>

4. Find Difference between original and simulated images

<td><img src="../../../shortcodes/resources/images/LMSalgorithm/4.jpg" alt="Fourth step"/></td>

5. Shift colors towards visible spectrum by multiplying by error matrices

<td><img src="../../../shortcodes/resources/images/LMSalgorithm/5.jpg" alt="Fifth step"/></td>

6. Add shifted colors to original image

<td><img src="../../../shortcodes/resources/images/LMSalgorithm/6.jpg" alt="Sixth step"/></td>

#### **Testing for Color Blindness**

The Ishihara test for color blindness is named after a Japanese ophthalmologist Shinobu Ishihara who invented the test for the Japanese army in 1917. Ishihara has been a good screening test, but it is 100 years old and does not leverage the benefits of today’s computer-based adaptive testing protocols.

<img src="../../../shortcodes/resources/images/ishihara_test.png" alt="Ishihara test"/>

## **Code (solution) & results**

#### **Code (solution)**

<details>
<summary>
colorBlindnessCorrector.js
</summary>

```JavaScript:/sketches/brushHand.js
let correctorShader;
let img;
let blindnessType;
let input;
let reset;

function preload() {
  correctorShader = readShader('/sketches/workshop3/blindness.frag', { varyings: Tree.texcoords2 });
  img = loadImage('/docs/shortcodes/resources/images/ishiharaTest/Ishihara_00.jpg');
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(correctorShader);
  blindnessType = createRadio();
  blindnessType.option('1', 'RGB');
  blindnessType.option('5', 'Correct Protanopia');
  blindnessType.option('6', 'Correct Deuteranopia');
  blindnessType.option('7', 'Correct Tritanopia');
  blindnessType.selected('1');
  blindnessType.position(10, 10);
  blindnessType.style('color', 'white');
  blindnessType.changed(() => correctorShader.setUniform('blindnessType', blindnessType.value()));

  reset = createButton("Reset")
  reset.position(20, 450);

  input = createFileInput(handleFile, false);
  input.position(20, 480);

  reset.mousePressed(() => correctorShader.setUniform('texture', img));

  correctorShader.setUniform('texture', img);
  correctorShader.setUniform('blindnessType', blindnessType.value());

}

function draw() {
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}

function handleFile(file) {
  console.log(file);
  if (file.type === 'image') {
    img = loadImage(file.data);

    correctorShader.setUniform('texture', img);
  } else {
    img = null;
  }
}


```

</details>

<details>
<summary>
blindness.frag
</summary>

```JavaScript:/sketches/brushHand.js
precision mediump float;

// uniforms are defined and sent by the sketch
uniform int blindnessType;
uniform sampler2D texture;

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;

// returns simulated protanopia color of given texel
vec3 protanopia(vec3 texel) {
  //return 0.299 * texel.r + 0.+587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 protanopia = mat3(0.0, 0.0, 0.0, 2.02344, 1.0, 0.0, -2.52581, 0.0, 1.0);
  vec3 LMSP = protanopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RP = BackRGB*LMSP;
  return RP;
}

// returns corrected protanopia color of given texel
vec3 cprotanopia(vec3 texel) {
  //return 0.299 * texel.r + 0.+587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 protanopia = mat3(0.0, 0.0, 0.0, 2.02344, 1.0, 0.0, -2.52581, 0.0, 1.0);
  vec3 LMSP = protanopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RP = BackRGB*LMSP;
  vec3 Diff = tex - RP;
  mat3 EMP = mat3(0.0, 0.7, 0.7, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
  vec3 VEP = EMP*Diff;
  vec3 CIP = tex + VEP;
  return CIP;
  //return vec3(texel.r,texel.g,texel.b);
}

// returns deuteranopia color of given texel
vec3 duteranopia(vec3 texel) {
  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 duteranopia = mat3(1.0, 0.49421, 0.0, 0.0, 0.0, 0.0, 0.0, 1.24827, 1.0);
  vec3 LMSD = duteranopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RD = BackRGB*LMSD;
  return RD;
}

// returns corrected deuteranopia color of given texel
vec3 cduteranopia(vec3 texel) {
  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 duteranopia = mat3(1.0, 0.49421, 0.0, 0.0, 0.0, 0.0, 0.0, 1.24827, 1.0);
  vec3 LMSD = duteranopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RD = BackRGB*LMSD;
  vec3 Diff = tex - RD;
  mat3 EMD = mat3(1.0, 0.0, 0.0, 0.7, 0.0, 0.7, 0.0, 0.0, 1.0);
  vec3 VED = EMD*Diff;
  vec3 CID = tex + VED;
  return CID;
  //return vec3(texel.r,texel.g,texel.b);
}

// returns simulated tritanopia color of given texel
vec3 tritanopia(vec3 texel) {
  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 tritanopia = mat3(1.0, 0.0, -0.395913, 0.0, 1.0, 0.801109, 0.0, 0.0, 0.0);
  vec3 LMST = tritanopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RT = BackRGB*LMST;
  return RT;
  //return vec3(texel.r,texel.g,texel.b);
}

// returns corrected tritanopia color of given texel
vec3 ctritanopia(vec3 texel) {
  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 tritanopia = mat3(1.0, 0.0, -0.395913, 0.0, 1.0, 0.801109, 0.0, 0.0, 0.0);
  vec3 LMST = tritanopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RT = BackRGB*LMST;
  vec3 Diff = tex - RT;
  mat3 EMT = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.7, 0.7, 0.0);
  vec3 VET = EMT*Diff;
  vec3 CIT = tex + VET;
  return CIT;
  //return vec3(texel.r,texel.g,texel.b);
}

void main() {
  vec4 texel = texture2D(texture, texcoords2);
  if(blindnessType == 3) {
    gl_FragColor = vec4((vec3(duteranopia(texel.rgb))), 1.0);
  }else if(blindnessType == 6) {
    gl_FragColor = vec4((vec3(cduteranopia(texel.rgb))), 1.0);
  }else if(blindnessType == 7) {
    gl_FragColor = vec4((vec3(ctritanopia(texel.rgb))), 1.0);
  }else if(blindnessType == 5) {
    gl_FragColor = vec4((vec3(cprotanopia(texel.rgb))), 1.0);
  }else if(blindnessType == 4) {
    gl_FragColor = vec4((vec3(tritanopia(texel.rgb))), 1.0);
  }else if(blindnessType == 2) {
    gl_FragColor = vec4((vec3(protanopia(texel.rgb))), 1.0);
  }else{
    gl_FragColor = texel;
  }

}
```

</details>

<style>
    iframe div label{
        margin-right: 20px;
    }
</style>

{{< p5-iframe sketch="/sketches/workshop3/blindness.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="725" height="525">}}

#### **Results**

Image seen from the point of view of a person with no color blindness

<td><img src="../../../shortcodes/resources/images/ishiharaTest/Ishihara_01.jpg" alt="Normal"/></td>

Image seen from the point of view of a person with protanopia

<td><img src="../../../shortcodes/resources/images/Protanopia/Protanopia1.jpg" alt="Third step"/></td>

Corrected image from the point of view of a person seen with protanopia

<td><img src="../../../shortcodes/resources/images/Protanopia/CorrectedSeenProtanopia1.jpg" alt="Third step"/></td>

## **Conclusions**

- Color blindness affects a large number of individuals, with protans and deutans being the most common types.
- Color blindness affects approximately every 1 in 12 men (8%) and 1 in 200 women (0.5%).
- Image correction is possible, depending on the type of color blindness of the user, to facilitate the task of distinguishing colors that are more difficult to discern.

## **References**

- [Enchroma. What is color blindness?](https://enchroma.com/pages/what-is-color-blindness)
- [Enchroma. Types of Color Blindness](https://enchroma.com/pages/types-of-color-blindness)
- [North Country Eye Care. Enchroma Lenses for Colorblindness](https://www.northcountryeyecare.com/eyeglasses/enchroma-lenses-for-colorblindness/)
- [National Health Service (NHS). Colour vision deficiency](https://www.nhs.uk/conditions/colour-vision-deficiency/)
- [Smartphone Based Image Color Correction for Color Blindness](https://www.researchgate.net/publication/326626897_Smartphone_Based_Image_Color_Correction_for_Color_Blindness)
