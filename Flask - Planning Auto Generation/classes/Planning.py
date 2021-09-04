import random

class Planning:
    # Hard constraints 
    allowed_time = [0,7,7,5,7,7,0]
    Restricted_all = [{"startH" : 17, "endH" : 30 ,"startMin" : 23, "endMin" : 59 },
                      {"startH" : 00, "endH" : 00 ,"startMin" : 7, "endMin" : 59 } ]
    Restricted_days = [[],[],[],[{"startH" : 14, "endH" : 00 ,"startMin" : 17, "endMin" : 29 }],[],[],[]]
    
    # Soft constraints 
    Not_allowed_all = [{"startH" : 13, "endH" : 14 ,"startMin" : 0, "endMin" : 0 }]
    
    # Generation state variables
    current_time = [ {"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},
    {"startH" : 8,"startMin" : 0}, {"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0}]
    
    def __init__(self,cours,tdps,profs,requirements):
            self.cours = cours
            self.tdps = tdps
            self.profs = profs
            self.requirements = requirements
            self.days = [ [], [], [], [], [],[], [] ]
    
    def maximum(self,a, b):
        if a >= b:
            return a
        else:
            return b
    def interval_intersect(self,a,b):
        a0,a1 = a
        b0,b1 = b
        return max(0,min(a1,b1)-max(a0,b0))
        
    def conflict(self,restricted_time,current,element):
        positionsStartH = current["startH"]
        positionStartMin = current["startMin"] 
        positionsEndH = current["startH"] + element["hour"]
        positionEndMin = current["startMin"] + element["min"]
        if self.interval_intersect((positionsStartH + positionStartMin / 60 ,positionsEndH + positionEndMin / 60),
                (restricted_time["startH"]+restricted_time["startMin"]/60,restricted_time["endH"]+restricted_time["endMin"]/60)) > 0 :
            return True
        else :
            return False
        
          
       
    def get_next_time(self,day,element):
        print("THIS IS THE OVERLAPPED TIME")
        print(self.interval_intersect((self.current_time[day]["startH"]+self.current_time[day]["startMin"]/60,self.current_time[day]["startH"]+element["hour"] +
                element["min"]/60),(12.10,13.59)))
        current= self.current_time[day]
        restricted = self.Restricted_days[day]
        restricted = sorted(restricted, key=lambda x: (x['startH'] , x['startMin']),reverse=False)

        for restricted_time in restricted:
            if self.conflict(restricted_time,current,element):
                print(" the algorithm found a conflict in day : ",day, " for element : ",element["name"])
                self.current_time[day] = {"startH" : restricted_time["endH"],"startMin" : restricted_time["endMin"]}
                print("ALGORITHM getting next time : ---------> ")
                print( "int 1 --> ",self.current_time[day]["startH"]+self.current_time[day]["startMin"]/60 ," , " ,  elf.current_time[day]["startH"]+element["hour"] +
                element["min"]/60)
                if  self.interval_intersect((self.current_time[day]["startH"]+self.current_time[day]["startMin"]/60,self.current_time[day]["startH"]+element["hour"] +
                element["min"]/60),(12,14)) >= 1 : 
                    
                    print("Overlapped interval in IF")
                    self.current_time[day]["startH"] = self.current_time[day]["startH"] + (14 - self.current_time[day]["startH"])
                    self.current_time[day]["startMin"] = 0
                return self.current_time[day]
        

        if  self.interval_intersect((self.current_time[day]["startH"]+self.current_time[day]["startMin"]/60,self.current_time[day]["startH"]+element["hour"] +
                element["min"]/60),(12,14)) >= 1 :
                    print("Overlapped interval in ELSE")
                    current["startH"] = current["startH"] + (14 - current["startH"])
                    current["startMin"] = 0
        
        return current
    
    def init_cours(self):
        for cour in self.cours.cours:
            if len(cour["positionscours"]) > 0 : 
                position = cour["positionscours"][0]
                cour["ignore"] = True
                cour["startH"] = position["startH"]
                cour["startMin"] = position["startMin"]
                cour["endH"] = position["endH"]
                cour["endMin"] = position["endMin"]
                self.days[position["day"]].append(cour)
                self.Restricted_days[position["day"]].append({"startH" : position["startH"], "endH" : position["endH"] ,
                                        "startMin" : position["startMin"], "endMin" : position["endMin"] })
        
                

    def sum_time(self,index):
        sumH = 0 
        sumMin = 0 
        for element in self.days[index] :
            sumH = sumH + element["hour"]
            sumMin = sumMin + element["min"]
        return sumH + (sumMin / 60)

    def sum_available(self):
        sumH = 0 
        for time in self.allowed_time :
            sumH = sumH + time
        return sumH  

    def sum_all(self):
        sumH = 0 
        sumMin = 0 
        for element in self.cours.cours :
            print(element["name"])
            sumH = sumH + element["hour"]
            sumMin = sumMin + element["min"]
        for element in self.tdps.tdps :
            print(element["name"])
            sumH = sumH + element["hour"]
            sumMin = sumMin + element["min"]    
        return sumH + (sumMin / 60) 
    
    def start_generating(self):
            required_time = self.sum_all()
            available_time = self.sum_available()
            if available_time < required_time : 
                 print("Can't generate planning : NO_ENOGH_TIME , Available time = " , available_time ,"H Require time = " , required_time )
            else :
                self.init_cours()
                self.init_population()
                self.set_time()
                

    def set_time(self):
        self.current_time = [ {"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},
                 {"startH" : 8,"startMin" : 0}, {"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0}] 
        print(" Setting time ...")
        for i in range(7):
            for element in self.days[i]:
                if "ignore" in  element:
                    continue

                current = self.get_next_time(i,element)

                # Init the start of the element
                element["startH"] = current["startH"]
                element["startMin"] = current["startMin"]

                # Init the end of the element
                endH = current["startH"] + element["hour"] + (current["startMin"] + element["min"]) % 60
                endMin = (current["startMin"] + element["min"]) % 60

                element["endH"] =  endH
                element["endMin"] = endMin
                
                # Updating new start for next 
                print("we will set time to : ",endH,":",endMin)
                
                self.current_time[i]["startH"] = endH
                self.current_time[i]["startMin"] = endMin

        print(" Finish Setting time : success")
       
   
    def init_population(self):
        fulled = []
        index = random.randint(1,5)  
        def random_dayIndex(value):
            value = random.randint(1,5)
            while value in fulled : 
                value = random.randint(1,5)     
            return value 
       

        # Giving random days to TDs/TPs/courses
        print(" STEP 3 - Affecting TDs/TPs/Cours to random days ...") 
        i = 0
        while i <= len(self.cours.cours) - 1 :
            if len(self.days[index]) > 1 :
                index = random_dayIndex(index)
                continue
            if not "ignore" in self.cours.cours[i] :
                    used_time = self.sum_time(index)
                    sum_time = used_time + self.cours.cours[i]["hour"] + self.cours.cours[i]["min"]  / 60
                    print("time already used  on day : ",index," is : ",used_time, "H available time : ",self.allowed_time[index] - used_time ," H")
                    if sum_time <= self.allowed_time[index] :
                        self.cours.cours[i]["day"] = index
                        self.cours.cours[i]["type"] = 0
                        self.days[index].append(self.cours.cours[i])
                        print(" - ",self.cours.cours[i]["name"] ," affected to day --> ", self.cours.cours[i]["day"])
                    else :
                        print(" - ",self.cours.cours[i]["name"] ," can't be affected to day --> ", index ," LIMIT_TIME_REACHED") 
                        fulled.append(index)
                        
                        print(fulled)
                        if len(fulled) == 5 :
                            print("all days are fulled problem working on solution")
                            fulled = []
                            self.days= [[],[],[],[],[],[],[]]
                            self.start_generating()
                            break
                        index = random_dayIndex(index)
                        continue
            index = random_dayIndex(index)
            i = i + 1
            fulled = [] 

        i = 0
        while i <= len(self.tdps.tdps) - 1 :
                used_time = self.sum_time(index)
                sum_time = used_time + self.tdps.tdps[i]["hour"] + self.tdps.tdps[i]["min"]  / 60
                print("time already used  on day : ",index," is : ",used_time, "H available time : ",self.allowed_time[index] - used_time ," H")
                if sum_time <= self.allowed_time[index] :
                    self.tdps.tdps[i]["day"] = index
                    self.tdps.tdps[i]["type"] = 1
                    self.days[index].append(self.tdps.tdps[i])
                    print(" - ",self.tdps.tdps[i]["name"] ," affected to day --> ", self.tdps.tdps[i]["day"]) 
                    
                else :
                    print(" - ",self.tdps.tdps[i]["name"] ," can't be affected to day --> ", index ," LIMIT_TIME_REACHED")
                    print("current -> " ,index)
                    fulled.append(index)
                    print("Fulled length is  : ",len(fulled) )
                    print(fulled)
                    if len(fulled) == 5 :
                            print("all days are fulled problem working on solution")
                            fulled = []
                            self.days= [[],[],[],[],[],[],[]]
                            self.start_generating()
                            break
                    index = random_dayIndex(index)
                    continue
                
                index = random_dayIndex(index)
                i = i + 1
                fulled = [] 
           
               
            
                
            
            
        
    

# init population with applying contraint
# fitness function
# creating new population id needed