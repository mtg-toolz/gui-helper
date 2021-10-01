from os import listdir, makedirs, replace
from os.path import isfile, join
from shutil import copy
from dataclasses import dataclass, field
from typing import List
import filecmp

fronts_path = "images/fronts/"
backs_path = "images/backs/"
cards_path = "cards/"
fronts = []
backs = []
paths = [fronts_path, backs_path]
card_lists = [fronts, backs]
cardback_id = "1LrVX0pUcye9n_0RtaDNVl2xPrQgn7CYf"

@dataclass
class Card:
    filename: str = ""							#name of file in the Proximity output folder
    full_filename: str = ""						#filename with ID appended
    stripped_filename: str = ""					#filename with leading index number removed
    slots: List = field(default_factory=list)	

#Get list of files in images/fronts
#Get list of files in images/backs

i = 0
for path in paths:
	for f in listdir(path):
		if isfile(join(path, f)):
			#For each file in each list:
			#	create a "full_filename" : split into name and ext; = "name (xxx).ext"
			#	create a "slots" index : number at the start of filename (all characters before first space)
			new_card = Card()
			new_card.filename = f
			new_card.full_filename = f.split(".")[0] + " (xxx)." + f.split(".")[1]
			new_card.slots.append(int(f.split()[0]) - 1)	#Proximity filenames are indexed from 1 
			new_card.stripped_filename = f[len(f.split()[0])+1:]
			card_lists[i].append(new_card)
	i = i+1

num_cards = len(fronts)

#sort the lists by slots id
def sortfunc(n):
	return n.slots[0]

for card_list in card_lists:
	card_list.sort(key = sortfunc)

#determine which cards need generic backs
generic_back_slots = [x for x in range(num_cards)]
for back in backs:
	generic_back_slots.remove(back.slots[0])
		
# combine duplicate cards into a single entry
to_remove = []
i = 0
for card_list in card_lists:
	for x in range(len(card_list)):
		for y in range(x+1, len(card_list)):
			if not(card_list[x].filename in to_remove) and not(card_list[y].filename in to_remove):
				if card_list[x].stripped_filename == card_list[y].stripped_filename:
					if filecmp.cmp(paths[i] + card_list[x].filename, paths[i] + card_list[y].filename, shallow=False):
						card_list[x].slots.append(card_list[y].slots[0])
						to_remove.append(card_list[y].filename)
	i = i+1

for x in to_remove:					
	for card_list in card_lists:
		for card in card_list:
			if card.filename == x:
				print("ignoring duplicate image " + x)
				card_list.remove(card)

#move files in both lists to "Cards" folder, renaming to "full_filename"
i = 0
makedirs(cards_path, exist_ok=True)
for card_list in card_lists:
	for card in card_list:
		# replace(paths[i] + card.filename, cards_path + card.full_filename)
		copy(paths[i] + card.filename, cards_path + card.full_filename)
	i = i + 1

#add generic backs
if len(generic_back_slots) > 0:
	new_card = Card()
	new_card.filename = "cardback.png"
	new_card.full_filename = cards_path + "cardback (xxx).png"
	new_card.slots = generic_back_slots
	new_card.stripped_filename = "cardback.png"
	backs.append(new_card)
	
#Copy cardback.png to "Cards" folder, renaming to "name (id).ext"
copy("cardback.png", cards_path + "cardback (xxx).png")


#Compare list size to MPC bundle sizes and pick next largest
MPC_bundle_sizes = [18, 36, 55, 72, 90, 108, 126, 144, 162, 180, 198, 216, 234, 396, 504, 612]
MPC_bracket = MPC_bundle_sizes[0]
MPC_bundle_sizes.reverse()

for size in MPC_bundle_sizes:
	if size >= num_cards:
		MPC_bracket = size


#Build the XML tree:
import xml.etree.ElementTree as ET
print("Creating XML")

#Create "order"
order = ET.Element("order")
print("order")
xmltree = ET.ElementTree(order)
#	Create "details"
details = ET.SubElement(order, "details")
print("    details")
#		Create "quantity" = size of list of fronts
quantity = ET.SubElement(details, "quantity")
quantity.text = str(num_cards)
print("        quantity = " + quantity.text)
#		Create "bracket" = MPC bundle size
bracket = ET.SubElement(details, "bracket")
bracket.text = str(MPC_bracket)
print("        bracket = " + bracket.text)
#		Create "stock" = "(S30) Standard Smooth"
stock = ET.SubElement(details, "stock")
stock.text = "(S30) Standard Smooth"
print("        stock = " + stock.text)
#		Create "foil" = "false"
foil = ET.SubElement(details, "foil")
foil.text = "false"
print("        foil = " + foil.text)
#	Create "fronts"
xml_fronts = ET.SubElement(order, "fronts")
#	Create "backs"
xml_backs = ET.SubElement(order, "backs")

#		Create "card" (for each item on each card list)
i = 0
xml_card_lists = [xml_fronts, xml_backs]

for card_list in card_lists:
	print("    " + xml_card_lists[i].tag)
	for card in card_list:
		xml_card = ET.SubElement(xml_card_lists[i], "card")
		print("        card")
		# Create "id" = "xxx"
		id = ET.SubElement(xml_card, "id")
		id.text = "xxx"
		print("            id = " + id.text)
		# Create "slots" = slots field of file list
		slots = ET.SubElement(xml_card, "slots")
		slots_as_string = str(card.slots)
		#trim the string to remove [] brackets
		slots.text = slots_as_string[1:len(slots_as_string)-1]
		print("            slots = " + slots.text)
		# Create "name" = original filename
		name = ET.SubElement(xml_card, "name")
		name.text = card.filename
		print("            name = " + name.text)
		# Create "query" = probably ok as nothing, can use filename
		query = ET.SubElement(xml_card, "query")
		query.text = card.filename.split(".")[0]
		print("            query = " + query.text)
	i = i + 1
#	Create "cardback"
cardback = ET.SubElement(order, "cardback")
#cardback.text = cardback_id
#print("    cardback = " + cardback.text)

#Write the XML to cards.xml	
xmltree.write("cards.xml")
print("CardXML complete, now run autofill.exe to create your order")