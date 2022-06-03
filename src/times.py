from asyncio import Handle
from re import match
from create import check_answer

"""
This fuction checks if the time is in the correct format.
Ex.: 12.98 (seconds), 01:23.98 (minutes) or 02:34:45.67(hours)
"""
def check_time(time:str) -> bool:
	
	if len(time) == 5:
		answer = bool(match("[0-5][0-9][.][0-9][0-9]",time))
	
	elif len(time) == 8:
		answer = bool(match("[0-5][0-9][:][0-5][0-9][.][0-9][0-9]",time))
	
	elif len(time) == 11:
		answer = bool(match("[0-9][0-9][:][0-5][0-9][:][0-5][0-9][.][0-9][0-9]",time))
	
	else: answer = False

	return answer

"""
Function responsible to update the dictionary "times_info"
Just like "check_distance" in "new_practice", "check_time" is being used here to be sure the time's format is correct
The steps in this one are:
-> Get the event which time will be recorded
-> Loop with "check_time" as condition to guarantee the correct format
-> Creates a list with the times of the event and put them in order (fastest to slowest)
-> Repeat until the user stops
"""
def new_time(times_info:dict):
	new_op = input("\nDo you want to record a new time?[Yes/No]\n")
	control = check_answer(new_op)
	
	while(control):
		event = input("\nWhich event is going to be recorded?\n")
		valid_time = False
		while(not valid_time):
			time = input("\nWhat is the time?\n")
			valid_time = check_time(time)
			if not valid_time: 
				print("\nNot the correct format\n")
		
		all_times = times_info.get(event, [])
		all_times.append(time)

		times_info[event] = all_times
		times_info[event].sort(key = lambda time: (len(time), time))
		
		new_op = input("\nDo you want to record a new time?[Yes/No]\n")
		control = check_answer(new_op)

"""
It writes the information in "times_info" at the file
"""
def write_times_info(handle:Handle, times_info:dict):
	handle.write("\nTimes:\n\n")

	for event, times in times_info.items():
		handle.write("->"+event+":\n")
		count = 1
		
		for i in times:
			sentence ="("+str(count)+") "+i+"\n"
			handle.write(sentence)
			count += 1

		handle.write("\n")