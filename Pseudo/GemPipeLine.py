import math
import statistics
"""
First the user would enter a seed value in html, then js would use this seed value into a number in base 36

the seed value will first be used to call a switch statement in the js code that will determine the geometry used for the gem

"""
def Base36(seed):
    seed = int(seed,36)
    seed = str(seed)
    i=0
    while True:
        if len(str(seed)) < 10:
            seed += seed[i]
            i+=1
        else:
            break
    return int(seed)

listOfObjects =["Cube", "Hex Bipyramid", "Icosahedron", "Oct Cupola", "Octahedron", "Pyramid", "Sphere", "Square Antiprism", "Torus", "Triak Tetrahedron",  "Triaug Pyramid", "Truncated Cube"]
def geo(seed):
    x= ("Its a ")
    geo = (seed % 12)
    return( x + listOfObjects[geo])

def digitSum(seed,isfirst = True):
    sum =0
    for digits in (str(seed)):
        sum+= int(digits)
    if sum > 10 and isfirst:
        return(digitSum(sum))
    else:
        return(sum)
    
def magnitude(seed):
    x= seed/ 3656158440062975
    return float(x)

def common(seed):
    listgirl = []
    for digit in str(seed):
        listgirl.append(digit)
    x= (int(statistics.mode(listgirl))%2)
    return int(x)

def firstDigit(seed):
    x = str(seed)[0]
    return int(x)

def isShiny(seed):
    if (seed % 2) == 0:
        return True
    else:
        return False
    
listOfTextures=["voronoi", "value noise", "perlin", "striped "]

# print(9007199254740991)
# print(digitSum(seed,True))
# print(magnitude(seed))
# print(common(seed))

"""
the seed value would then be used to get a set amount of uniforms to bring into the shader
-- possible uniforms
-for color i believe the amount should be between 1 and 3, and that part of the seed should determine that and that the colors will be passed in as uniforms
- binary string for if statements
-better to use arrays
"""


"""
with this it opens the possibility of levels of heirarchy in characteristics and in that, rarity
we can have 12 possible categories, 3 of them can be metacategories that allow other categories to happen
ie 2 categories can be a striped texture or a noise texture.
a metacategory could choose if it would display one of these textures, or a blend of both

since seeds are input by the user, we can assume that they have a high level of randomness since there is a high level of entropy

Things i can extrapolate from the seed value
- even or odd
- modulo
- amount of a certain number in the total number
the total of the numbers digits
- the digit sum (0-9)


list of metacategories
- amount of colors present in gemstones
    - color ramp positions
- amount of textures present in gemstones
    -texture blending in gemstone if the gemstone is blended



list of categories
color
    -random rgb
texture implemented
    -voronoi, value noise, perlin, striped 
    float 1-4
amount of color ramp nodes
float -colors + randomcolormultiply
color ramp positions
    -should direclty correspond with the colors present in the gemstone but color nodes should have a random chance of doubling and distributing somewhere on the color ramp
    -
roughness
    - could be boolean (isrough/isnot)
    *even odd

https://www.cs.utexas.edu/~theshark/courses/cs354/lectures/cs354-21.pdf


the shader would then call multiple if statements to see what charecteristics of the gem will be passed into the gem

// characteristics of the gem
- color
- banding
- noise
- shininess


#Gem Pipeline

first the js file will determine what shape the gem is and how many colors it will have and how many textures it will have.

then the file will pass in all of the parameters needed to initialize the noise and color functions as a 

!- Pick Shape 0-12
    -switch statement call
!- Determine the amount of textures 0-4
- Determine which textures are used
    - call the function to add the value to the function then divide by 2 or clamp
    - mix the noise between another noise texture or texture gradient
-initialize textures
    -Scale
    -octaves
    -position
- Pick Amount of colors 0-3
- Pick colors - practically infinite
    - append colors to color ramp and change around their positions
-pick is shiny or not

//glsl pseudo
uniform = 100110101
uniform seed
vec3 finalcolor = vec3(0);

if "condition 1 is true"
    color += "result"

if "condition 2 is true"
    color += mix(tex1,tex2,tex3)

-numofcolors
if amtofcolors 2
    color = mix(color1,color2,textures)
if amtofcolors 3
    textures -= .6;
    color = mix(mix(color1,color2,(textures-.6),color3,)
    colorramp(numofcolors,color*using the textures as the factor*)
-shiny
if last digit == 1
    shiny = code that would add reflections and lighting to shape
    color += shiny
"""
seed = "zzzzzzzzzx"
seed = Base36(seed)
print(seed)
print(geo(seed))
"""
If condition = 1 then there will be 1 texture, otherwise there will be three textures, where one will blend between the two"""
if (firstDigit(seed)%2) == 0:
    listOfTextures.remove(listOfTextures[digitSum(seed) % 4])
    print(listOfTextures)
    blendTex = listOfTextures[ common(seed)% 2]
    print("The Blending texture is")
    print(blendTex)
else:
    print("The texture of the object will be")
    print(listOfTextures[digitSum(seed) % 4])

def colorAmt(seed):
    if magnitude(seed)>.85:
        print("the seed will have 3 colors")
        return(3)
    elif magnitude(seed)>.01:
        print("the seed will have 2 colors")
        return(2)
    else:
        print("the seed will have 1 color")
        return(1)

def colorReturn(seed):
    color=[]
    x=0
    for i in range(3):
        seed = str(seed)
        y = x+3
        
        colorSlice = int(seed[x:y]) % 255
        color.append(colorSlice)
        x+= 3
    return(color)
listofColors =[]
for x in range(colorAmt(seed)):
    seed *= (x+1) #This will be replaced with an LCG
    seed = seed % 3656158440062975

    listofColors.append(colorReturn(seed))
print(listofColors)