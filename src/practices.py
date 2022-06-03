from asyncio import Handle
from create import check_answer

"""
Checks if the distance passed as argument it's in the correct format.
Ex.: 1200m or 1450yds
"""
def check_distance(distance:str) -> bool:
	answer = True

	if "m" in distance or "yds" in distance:
		distance_number = distance.strip("m|yds")
		try:
			int(distance_number)
		except:
			answer = False

	else: 
		answer = False

	return answer

"""
This function calculate the total distance by adding 
all the distances(first values of the keys).
It also convert meters to yards and vice-versa.
"""
def total_distance(practice_info:dict) -> tuple:
	total_m = 0

	for train in practice_info.keys():
		current = practice_info[train][0]
		if "m" in current:
			current_int = int(current.strip("m"))
		else:
			current_int = int(current.strip("yds"))
			current_int *= 0.9144

		total_m += int(current_int)

	total_yds = int(total_m * 1.0936)

	return (total_m,total_yds)

"""
This function is responsible to update the dictionary "practice_info" with new practices.
It also uses other functions like "check_distance" to be certain there won't be distances in invalid formats.
The steps of updating are:
-> Get the distance and the respective unit
-> Be certain that the format is correct by using a "while loop" with "check_distance" as the condition
-> Get te practice number and a summary about the same
-> Repeat the whole process until the user is done 
"""
def new_practice(practice_info:dict):
	new_op = input("\nDo you want to record a new practice?[Yes/No]\n")
	control = check_answer(new_op)

	while(control):
		valid_distance = False
		while(not valid_distance):
			distance = input("\nWhat is the total distance in this practice?(m/yds)\n")
			valid_distance = check_distance(distance)
			if not valid_distance: 
				print("\nNot the correct format\n")

		practice_number = len(practice_info) + 1
		
		summary = input("\nWrite a summary about the practice\n")
		
		current_practice = "#" + str(practice_number)
		practice_info[current_practice] = [distance,summary]

		new_op = input("\nDo you want to record a new practice?[Yes/No]\n")
		control = check_answer(new_op)

"""
It writes the information in "practice_info" at the file
"""
def write_practice_info(handle:Handle, practice_info:dict):
	handle.write("\nPractices:\n\n")

	for prac_number, prac_info in practice_info.items():
		sentence = prac_number+": "+prac_info[0]+"; "+prac_info[1]+"\n"
		handle.write(sentence)

	(total_m, total_yds) = total_distance(practice_info)
	sentence = str(total_m)+"m or "+str(total_yds)+"yds\n"
	handle.write("\nTotal distance: "+sentence)