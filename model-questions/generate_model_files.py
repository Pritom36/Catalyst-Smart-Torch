import os

# Target folder
folder = r"F:\PRITOM HSC\Main plan\HTML\BRAC Model\model-questions"
os.makedirs(folder, exist_ok=True)

# Common HTML structure
template_start = '''<!DOCTYPE html>

<html lang="en"> 
<head> 
  <meta charset="UTF-8"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
  <title>Catalyst Brac University</title> 
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML" async></script> 
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> 
  <link rel="stylesheet" href="js/themes.css"> 
</head> 
<body> 

<!-- Navigation bar --> 
<div class="navbar"> 
  <div class="nav-item" onclick="location.href='../index.html'">Home</div> 
  <div class="dropdown"> 
    <div class="nav-item">Theme</div> 
    <div class="dropdown-content"> 
      <a href="#" onclick="setTheme(1)">Theme 1</a> 
      <a href="#" onclick="setTheme(2)">Theme 2</a> 
      <a href="#" onclick="setTheme(3)">Theme 3</a> 
      <a href="#" onclick="setTheme(4)">Theme 4</a> 
    </div> 
  </div> 
</div>
'''

template_end = '''
<footer align="center"> 
  <p>© 2023 All rights reserved.</p> 
</footer> 

<script src="js/themes.js"></script> 
<script src="js/protection.js"></script> 
</body> 
</html>
'''

# Create HTML files
for i in range(5, 31):
    file_path = os.path.join(folder, f"model-{i}.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(template_start)
        f.write(f'<h2 align="center">Model Question - {i}</h2>\n')
        f.write(template_end)

print("✅ All model pages created successfully!")
