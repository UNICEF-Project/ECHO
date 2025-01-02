import pandas as pd

img_path = 'colorTesting.jpg'
csv_path = 'colors.csv'

# reading csv file
index = ['color', 'color_name', 'hex', 'R', 'G', 'B']
df = pd.read_csv(csv_path, names=index, header=None)

r = g = b = xpos = ypos = None



def get_color_name(R, G, B):
    minimum = 1000
    for i in range(len(df)):
        d = abs(R - int(df.loc[i, 'R'])) + abs(G - int(df.loc[i, 'G'])) + abs(B - int(df.loc[i, 'B'])) # type: ignore
        if d <= minimum:
            minimum = d
            cname = df.loc[i, 'color_name']

    return cname

# function to get x,y coordinates of mouse double click


def draw_function(x, y,img):
    global b, g, r, xpos, ypos, clicked
    clicked = True
    xpos = x
    ypos = y
    b, g, r = img[y, x]
    b = int(b)
    g = int(g)
    r = int(r)
    print("r ", r, "g : ", g, "b ", b)
    print("color name : ", get_color_name(r, g, b))
    return (get_color_name(r, g, b), str(r), str(g), str(b))


