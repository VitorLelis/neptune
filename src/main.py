from create import info, check_answer
from update import update_season

print("\nWelcome to Neptune!\n\nWhat do you wish?")

control = True

"""
Based in the option made by the user, 
the programm will execute a different action until the user chooses to stop. 
"""

while(control):
	print("\n1->Start a new season\n2->Update a previous season\n3->Quit\n")
	start = input()
	try:
		s = int(start)
	except:
		s = 0

	if s in [1,2,3]: 
		if s == 1: info()
		elif s == 2: update_season()

	else: 
		print("\nSorry, I didn't undertand it\n")

	new_op = input("\nDo you want to do something else?[Yes/No]\n")
	control = check_answer(new_op)

print("\nGood luck, swimmer!\n")
quit()
