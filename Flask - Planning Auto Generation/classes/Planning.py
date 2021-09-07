import random

class Planning:
    # Grades 
    grades_cours = {"MCA" : 0 , "MCB" : 0 , "Pr" : 0  }
    grades_tdp= {"MCA" : 0 , "MCB" : 0 ,  "Pr" : 0 }
    # Hard constraints 
    allowed_time = [0,7,7,5,7,7,0]
   
    Restricted_days = [[],[],[],[{"startH" : 14, "endH" : 00 ,"startMin" : 17, "endMin" : 29 }],[],[],[]]
    
    
    
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
        print("Day : ------------------ " , day )
        print(self.interval_intersect((self.current_time[day]["startH"]+self.current_time[day]["startMin"]/60,self.current_time[day]["startH"]+element["hour"] +
                element["min"]/60),(12.10,13.59)))
        current= self.current_time[day]
        restricted = self.Restricted_days[day]
        restricted = sorted(restricted, key=lambda x: (x['startH'] , x['startMin']),reverse=False)

        for restricted_time in restricted:
            if self.conflict(restricted_time,current,element):
                print(" the algorithm found a conflict in day : ",day, " for element : ",element["name"])
                self.current_time[day] = {"startH" : restricted_time["endH"],"startMin" : restricted_time["endMin"]}
               
                print( "int 1 --> ",self.current_time[day]["startH"]+self.current_time[day]["startMin"]/60 ," , " ,  self.current_time[day]["startH"]+element["hour"] +
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
                cour["requirement"] = position["subrequirement"]
                cour["prof"] = position["user"]
                cour["day"] = position["day"]
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
                self.init()
                self.init_cours()
                self.init_population()
                self.set_time()
                self.setRequirement()
                self.setProf()
                max_iteration = 100
                result = False
                mutation_counter = 0
                
                
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
       
    def set_time_day(self,day):
        self.current_time = [ {"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},
                 {"startH" : 8,"startMin" : 0}, {"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0},{"startH" : 8,"startMin" : 0}] 
        print(" Setting time ...")
        for element in self.days[day]:
                if "ignore" in  element:
                    continue
                current = self.get_next_time(day,element)
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
                self.current_time[day]["startH"] = endH
                self.current_time[day]["startMin"] = endMin

        print(" Finish Setting time FOR DAY : success")
    
    def init(self) :
        for cour in self.cours.cours :
            cour['type'] = 0
        for tdp in self.tdps.tdps :
            tdp['type'] = 1
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
           
     # NOT READY FUNCTIONS
  
    def crossover(self , day1 , day2):
        save_day1 = []
        save_day2 = []
        
        elements= [] 
        print('crossover call for day : ' ,day1," ",day2)
        for element in self.days[day1] :
            save_day1.append(element)
            elements.append(element)
        for element in self.days[day2] :
            save_day2.append(element)
            elements.append(element)
        new_day1 = []
        new_day2 = []
        for element in self.days[day1] :
            if "ignore" in element :
                new_day1.append(element)
        for element in self.days[day2]:
            if  "ignore" in element :
                new_day2.append(element)
        if len(new_day1) or len(new_day2) : 
            print("There is cours to keep") 
        self.days[day1] = new_day1
        self.days[day2] = new_day2       
        fulled = []
        print(day1 ,' ', day2)
        index = random.randint(day1,day2) if day1 < day2 else random.randint(day2,day1) 
        
 
        i = 0
        while i <= len(elements) - 1 :

            if not "ignore" in elements[i] :
                    used_time = self.sum_time(index)
                    sum_time = used_time + elements[i]["hour"] + elements[i]["min"]  / 60
                    print("time already used  on day : ",index," is : ",used_time, "H available time : ",self.allowed_time[index] - used_time ," H")
                    if sum_time <= self.allowed_time[index] :
                        elements[i]["day"] = index
                        self.days[index].append(elements[i])
                        print("CROSSOVER  - ",elements[i]["name"] ," affected to day --> ", elements[i]["day"])
                    else :
                        print("CROSSOVER  - ",elements[i]["name"] ," can't be affected to day --> ", index ," LIMIT_TIME_REACHED") 
                        fulled.append(index)
                        
                        if len(fulled) == 5 :
                            print("all days are fulled problem working on solution")
                            fulled = []
                            self.days[day1]= []
                            self.days[day2]= []
                            for element in save_day1 :
                                self.days[day1].append(element)
                                
                            for element in save_day2 :
                                self.days[day2].append(element)
                            self.crossover(day1,day2)
                            break
                        index = random.randint(day1,day2) if day1 < day2 else random.randint(day2,day1) 
                        continue
            index = random.randint(day1,day2) if day1 < day2 else random.randint(day2,day1) 
            i = i + 1
            fulled = []

            self.set_time_day(day1) 
            self.set_time_day(day2) 

    def mutation(self,day):
        print('Mutation function is called')         

    def evalute_planning(self) :
        print("evaluate current population")
        evaluation_results = [{"hard_constraints" : False}  , {"hard_constraints" : False}  , {"hard_constraints" : False}  , {"hard_constraints" : False} 
        , {"hard_constraints" : False}  , {"hard_constraints" : False}  , {"hard_constraints" : False} ]
        for i in range(7) :
            evaluation_results[i]["hard_constraints"] = self.evalute_day(i)

        return evaluation_results
                
    def evalute_day(self, index) :
        day_evaluation = True
        for element in self.days[index] :
            day_evaluation = day_evaluation and self.evalute_session(element) 
        return day_evaluation

    def evalute_session(self, element) :
        prof = element["prof"]["user"]
        salle = element["requirement"] 
        prof_bool = True
        salle_bool = True
        for position in prof["positions"] :
            if self.interval_intersect((position["startH"] +position["startMin"]/60 ,position["endH"]+position["endMin"]/60),
            (element["startH"] +element["startMin"]/60 ,element["endH"]+element["endMin"]/60)) > 0 :
                prof_bool = False
                break
        for position in prof["positionscours"] :
            if self.interval_intersect((position["startH"] +position["startMin"]/60 ,position["endH"]+position["endMin"]/60),
            (element["startH"] +element["startMin"]/60 ,element["endH"]+element["endMin"]/60)) > 0 :
                prof_bool = False
                break

        for use in salle["positions"] :
            if self.interval_intersect((use["startH"] +use["startMin"]/60 ,use["endH"]+use["endMin"]/60),
            (element["startH"] +element["startMin"]/60 ,element["endH"]+element["endMin"]/60)) > 0 :
                salle_bool = False
                break
        for use in salle["positionscours"] :
            if self.interval_intersect((use["startH"] +use["startMin"]/60 ,use["endH"]+use["endMin"]/60),
            (element["startH"] +element["startMin"]/60 ,element["endH"]+element["endMin"]/60)) > 0 :
                salle_bool = False
                break
        return prof_bool and salle_bool

    def setRequirement(self) :
        for day in self.days :
            for session in day :
                requirement = self.getRandomRequirement(session)
                session["requirement"] = requirement
    
    def setProf(self) :
        for day in self.days :
            for session in day :
                prof = self.getRandomProf(session)
                session["prof"] = prof

    def getRandomRequirement(self,session) :
        reqs = []

        for requirement in self.requirements.requirements :
            if requirement["requirementId"] == session["requirementId"] :
                reqs.append(requirement)
        if len(reqs) > 0  :
            return reqs[random.randint(0,len(reqs) -1)]  
        else :
            return None

    def getRandomProf(self,session) :
        profs = []
        if session["type"] == 0 :
            print("********************************")
            print(session)
            print("********************************")
            for prof in session["repsonsables"] :
                profs.append(prof)
            if len(profs) > 0  :
                return profs[random.randint(0,len(profs) -1)]  
            else :
                return None
        else : 
            for prof in session["repsonsablestdps"] :
                profs.append(prof)
            if len(profs) > 0  :
                return profs[random.randint(0,len(profs) -1)]  
            else :
                return None

# init population with applying contraint
# fitness function
# creating new population id needed