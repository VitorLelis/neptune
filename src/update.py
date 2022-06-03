from asyncio import Handle
from re import split
from create import logo_to_file
from practices import *
from times import *

"""
The function "save_info" creates 3 dictionary containing different types of information:
-> The basic info about the user(Name, Age, etc)
-> The practices info (Distance in yards or meters and comments about the practice)
-> The times info (Best time in each event)
"""
def save_info(handle:Handle) -> list:
	basic_info = dict()
	practice_info = dict()
	times_info = dict()

	basic = ["Name", "Age", "Specialty", "Season", "Goal"]

	for line in handle:
		if any(map(line.startswith, basic)):
			nline = split(": |\n", line)
			basic_info[nline[0]] = nline[1]

		elif line.startswith("#"):
			nline = split(": |; |\n", line)
			practice_info[nline[0]] = [nline[1],nline[2]]

		elif line.startswith("->"):
			event = split("->|:", line)[1]
			all_times = []

		elif line.startswith("("):
			time = line[4:].rstrip()
			all_times.append(time)
			times_info[event] = all_times

	return [basic_info, practice_info, times_info]

"""
It writes the information in "basic_info" at the file
"""
def write_basic_info(handle:Handle, basic_info:dict):
	handle.write("Name: %s\n" % basic_info["Name"])
	handle.write("Age: %s\n" % basic_info["Age"])
	handle.write("Specialty: %s\n" % basic_info["Specialty"])
	handle.write("\nSeason: %s\n" % basic_info["Season"])
	handle.write("\nGoal: %s\n" % basic_info["Goal"])

"""
This function  call the other ones in order to update the whole file
In order to update the file these steps are taken:
-> Open the file to read and save the information using "saving_info"
-> Call the fucntions "new_practice" and "new_time" to update them
-> Reopen the file but to rewrite the information this time
-> Call the functions that write in the file
-> Close the file 
"""
def update_season():
	control = True

	while(control):
		season_name = input("\nWhich season should we update?\n")
		try:
			season_handle = open(season_name+".txt")
			control = False
		except:
			print(f"\nThere is no season named {season_name}")

	(basic_info, practice_info, times_info) = save_info(season_handle)
	season_handle.close()

	new_practice(practice_info)
	new_time(times_info)

	new_season_handle = open(season_name+".txt", "w")
	write_basic_info(new_season_handle, basic_info)
	write_practice_info(new_season_handle, practice_info)
	write_times_info(new_season_handle, times_info)
	logo_to_file(new_season_handle)
	new_season_handle.close()
