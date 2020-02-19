import os

f = open("folderlist.txt", "r")

num2words = {1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', \
             6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', \
            11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', \
            15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', \
            19: 'Nineteen', 20: 'Twenty', 30: 'Thirty', 40: 'Forty', \
            50: 'Fifty', 60: 'Sixty', 70: 'Seventy', 80: 'Eighty', \
            90: 'Ninety', 0: 'Zero'}

def n2w(n):
	try:
	    return num2words[n]
	except KeyError:
	    try:
	        return num2words[n-n%10] + num2words[n%10].lower()
	    except:
	    	print("uh oh ")
	        pass

c = 0
for folder in f.readlines(): 
	names = list(filter(lambda a: a != '.DS_Store', os.listdir(folder.strip())))
	for n in names: 
		print "import " + n2w(c) + " from '../img/modelling/" + folder.strip() + '/' + n + "';"
		c += 1

print str(map(lambda a: n2w(a), list(range(c)))).replace("'", "")