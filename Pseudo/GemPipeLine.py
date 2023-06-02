import math
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
            print("Shorty")
            seed += seed[i]
            i+=1
        else:
            break
    return int(seed)

def geo(seed):
    x= ("Its a ")
    geo = (seed % 7)
    match geo:
        case 0:
            return(x+ "cupola")
        case 1:
            return(x+ "Cube")
        case 2:
            return(x+ "Pyramid")
        case 3:
            return(x+ "sphere")
        case 4:
            return(x+ "truncated Cube")
        case 5:
            return(x+ "octohedron")
        case 6:
            return(x+ "torus")
        case 7:
            return(x+ "square antprism")
        case 8:
            return(x+ "triagonal bipyramid")

        case other:
            return(other)

def digitSum(seed):
    sum =0
    for digits in (str(seed)):
        sum+= int(digits)
    if sum > 10:
        return(digitSum(sum))
    else:
        return(sum)
seed = "Mallory"

seed = Base36(seed)
print(seed)
print(9007199254740991)
print(digitSum(seed))
seednew = seed

    

"""
the seed value would then be used to get a set amount of uniforms to bring into the shader
-- possible uniforms
-for color i believe the amount should be between 1 and 3, and that part of the seed should determine that and that the colors will be passed in as uniforms
- binary string for if statements

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

list of metacategories
- amount of colors present in gemstones
    - color ramp positions
- amount of textures present in gemstones
    -texture blending in gemstone if the gemstone is blended



list of categories
color
    -random rgb
    
texture implemented
    -voronoi, value noise, perlin, honeycomb, striped 
amount of color ramp nodes
color ramp positions
    -should direclty correspond with the colors present in the gemstone but color nodes should have a random chance of doubling and distributing somewhere on the color ramp
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
- Pick Shape
    -switch statement call
- Determine the amount of textures
    -
- Determine which textures are used
    - call the function to add the value to the function then divide by 2 or clamp
- Pick Amount of colors
- Pick colors
    - append colors to color ramp and change around their positions
"""

seed = "Hello"


    