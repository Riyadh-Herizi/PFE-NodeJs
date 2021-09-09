import random

from flask import sessions


class GeneticAlgorithm:
    # Grades
    grades_cours = {"MCA": 0, "MCB": 0, "Pr": 0}
    grades_tdp = {"MCA": 0, "MCB": 0,  "Pr": 0}

    POPULATION_NUMBER = 100
    FITNESS_REQUIREMENT = 2
    MAX_ETIRATIONS = 1000
    MAX_ETIRATIONS_FOR_MUTATION = 50
    # Hard constraints
    allowed_time = [0, 7, 7, 5, 7, 7, 0]
    init_population_count = 0
    sessions = []
    population = []
    saved_population = []
    ordred_population = []
    temp_planning = []
    plannings = []
    def __init__(self, cours, tdps, profs, requirements):
        self.cours = cours
        self.tdps = tdps
        self.profs = profs
        self.sessions= []
        self.saved_population = []
        self.ordred_population= []  
        self.plannings= []        
        self.requirements = requirements

    def sum_available(self):
        sumH = 0 
        for time in self.allowed_time :
            sumH = sumH + time
        return sumH  

    def sum_all(self):
        sumH = 0 
        sumMin = 0 
        for element in self.cours.cours :
            sumH = sumH + element["hour"]
            sumMin = sumMin + element["min"]
        for element in self.tdps.tdps :
            sumH = sumH + element["hour"]
            sumMin = sumMin + element["min"]    
        return sumH + (sumMin / 60) 


    def generate_planning(self):
            required_time = self.sum_all()
            available_time = self.sum_available()
            if available_time < required_time : 
                 print("Can't generate planning : NO_ENOGH_TIME , Available time = " , available_time ,"H Require time = " , required_time )
            else :
                session = []
                for session in self.cours.cours:
                    if len(session["positionscours"]) > 0:
                        position_cour = session["positionscours"][0]
                        self.sessions.append({"id": session["id"],"prof" : { "user" : position_cour["user"]} , "keep": True, "day": position_cour["day"], "type": 0, "hour": session["hour"],
                                            "min": session["min"], "requirement": position_cour["subrequirement"], "coefficient": session["module"]["coefficient"], "name": session["name"],
                                            "startH": position_cour["startH"], "startMin": position_cour["startMin"], "endH": position_cour["endH"], "endMin": position_cour["endMin"]})
                    else:
                        self.sessions.append({"id": session["id"],  "keep": False, "day": -1, "type": 0, "hour": session["hour"],
                                            "min": session["min"], "requirementId": session["requirementId"], "coefficient": session["module"]["coefficient"], "name": session["name"]})

                for session in self.tdps.tdps:
                    self.sessions.append({"id": session["id"],  "keep": False, "type": 1, "day": -1, "hour": session["hour"],
                                        "min": session["min"], "requirementId": session["requirementId"], "coefficient": session["module"]["coefficient"], "name": session["name"]})

                # Init population
                self.initial_population()
                self.ordred_population = []
                self.ordred_population = sorted(self.population, key=lambda x: (  x['startH'] , x['startMin'], x['hour'], x['day'] ),reverse=False)
                counter = self.MAX_ETIRATIONS
                mutation_counter = self.MAX_ETIRATIONS_FOR_MUTATION
                while counter > 0 :
                    valide = self.evalute_population() 
                   
                    self.temp_planning = []   
                    if valide :
                        mutation_counter = self.MAX_ETIRATIONS_FOR_MUTATION
                        
                         
                    mutation_counter-=1

                    if mutation_counter == 0 :
                        self.execute_mutation() 
                        mutation_counter = self.MAX_ETIRATIONS_FOR_MUTATION
                    else :
                        self.execute_crossover() 
                    counter-=1
                

    def initial_population(self):
        self.temp_planning = []
        self.population = []
        for session in self.sessions :
            if session["keep"] and session["type"] == 0 :
                self.temp_planning.append(session)
            else :
                for i in range(self.POPULATION_NUMBER):
                    session_copy = session.copy()
                    session_copy["requirement"] = self.random_requirement(session["requirementId"])
                    session_copy["prof"] = self.random_prof(session["type"] , session["id"] )
                    session_copy["day"] = self.random_day()
                    session_copy["startH"] = self.random_time(session["hour"],session_copy["day"])
                    session_copy["startMin"] = 0 
                    session_copy["endH"] = session_copy["startH"] + session["hour"]
                    session_copy["endMin"] = session["min"]
                    if not self.check_if_exist_in_population(session_copy) :
                        self.population.append(session_copy)
        
        self.init_population_count = len(self.population)
       

                    

                
    def evalute_population(self):
        for element in self.ordred_population :
            fitness_value = self.evalute_session(element)
            element["fitness"] = fitness_value
            if fitness_value == 0 and self.check_add_for_planning_temp(element) :
                self.temp_planning.append(element.copy())
         
        if len(self.temp_planning) == (len(self.cours.cours)+ len(self.tdps.tdps)) :
            self.plannings.append(self.temp_planning.copy())
            return True
        else: 
            return False

    def evalute_session(self , element):
        fitness_value =  self.check_prof(element) + self.check_requirement(element) 
    
        return self.FITNESS_REQUIREMENT - fitness_value

    def check_prof(self,element):
        prof = element["prof"]["user"]
        for position in prof["positions"] :
            if self.interval_intersect((position["startH"] +position["startMin"]/60 ,position["endH"]+position["endMin"]/60),
            (element["startH"] +element["startMin"]/60 ,element["endH"]+element["endMin"]/60)) > 0 :
               return 0
        for position in prof["positionscours"] :
            if self.interval_intersect((position["startH"] +position["startMin"]/60 ,position["endH"]+position["endMin"]/60),
            (element["startH"] +element["startMin"]/60 ,element["endH"]+element["endMin"]/60)) > 0 :
               return 0
        return 1

    def check_requirement(self,element):
        salle = element["requirement"] 
        
        if salle != None :
            for use in salle["positions"] :
                if self.interval_intersect((use["startH"] +use["startMin"]/60 ,use["endH"]+use["endMin"]/60),
                (element["startH"] +element["startMin"]/60 ,element["endH"]+element["endMin"]/60)) > 0 :
                    return 0
                    
            for use in salle["positionscours"] :
                if self.interval_intersect((use["startH"] +use["startMin"]/60 ,use["endH"]+use["endMin"]/60),
                (element["startH"] +element["startMin"]/60 ,element["endH"]+element["endMin"]/60)) > 0 :
                    return 0   
        else :
            print(salle)
            print(element["name"])
        return 1

    def check_add_for_planning_temp(self,element):
        used_time = self.sum_time(element["day"])
        sum_time = used_time + element["hour"] + element["min"]  / 60
        if sum_time <= self.allowed_time[element["day"]] :
            for session in self.temp_planning : 
                if session["id"] == element["id"] and session["type"] == element["type"]:
                    return False
                else :
                    can_be_added = self.interval_intersect((element["startH"]+element["startMin"]/60,element["endH"]+element["endMin"]/60),
                    (session["startH"]+session["startMin"]/60,session["endH"]+session["endMin"]/60))
                    if session["day"] != element["day"]  :
                        continue
                    else :
                        if can_be_added == 0 :
                            continue
                        else :
                            return False
        else :
            return False        
                            

        return True

    def interval_intersect(self,a,b):
        a0,a1 = a
        b0,b1 = b
        return max(0,min(a1,b1)-max(a0,b0))
    
    def execute_crossover (self):
        self.ordred_population =  sorted(self.ordred_population, key=lambda x: ( x['fitness'] ),reverse=False)
        elements = []
        self.saved_population = []
        for i in range(len(self.ordred_population)) :
            if self.ordred_population[i]["fitness"] == 0 :
                self.saved_population.append(self.ordred_population[i].copy())
                elements.append(i)
        elements.sort(reverse=True)
        for i in elements :
           self.ordred_population.pop(i)         
        
        stop_index = int(round(len(self.ordred_population) * 0.5 ))
        new_list = []
        for i in range(stop_index) :
            new_list.append(self.ordred_population[i].copy())
        self.ordred_population = []
        self.ordred_population = new_list.copy()

        kids = []
        for element1 in  self.ordred_population :
            for element2 in  self.ordred_population :
                kid = element1.copy()
                kid1 = element1.copy()
                kid2 = element1.copy()
                if element1 != element2 :
                    kid["prof"] = element2["prof"]
                    kids.append(kid.copy())
                    kid1["requirement"] = element2["requirement"]
                    kids.append(kid1.copy())
                    kid2["startH"] = element2["startH"]
                    kid2["startMin"] = element2["startMin"]
                    kid2["endH"] = element2["startH"] + kid2["hour"]
                    kid2["endMin"] = element2["startMin"] + kid2["min"]
                    kids.append(kid2.copy())
        self.ordred_population = []

        print("-----------------------------------------------")
        print("element coupling: " , len(new_list) )
        print("kids number : " , len(kids) )
        print("saved number : " , len(self.saved_population) )
        for element in self.saved_population :
            self.ordred_population.append(element.copy())
        
        elements_count = 0
        for element in kids :
            if not element in self.ordred_population :
                elements_count+=1
                self.ordred_population.append(element.copy())
            if elements_count == 1000 :
                break
        kids = []
        print("new ordred number : " , len(self.ordred_population) )
        self.ordred_population = sorted(self.ordred_population, key=lambda x: ( x['startH'] , x['startMin'], x['hour'], x['day'] ),reverse=False)
        for session in self.sessions :
            if session["keep"] and session["type"] == 0 :
                self.temp_planning.append(session.copy())


        

      

        

        


    def execute_mutation(self):
        print("MUTAION rani hna hhhhhhh wtfff")
        for i in range(100) :
            index = random.randint(0 , len(self.ordred_population) -1 )
            self.ordred_population[index]["prof"] = self.random_prof(self.ordred_population[index]["type"],self.ordred_population[index]["id"])
            self.ordred_population[index]["requirement"] = self.random_requirement(self.ordred_population[index]["requirementId"])
            self.ordred_population[index]["startH"] = self.random_time(self.ordred_population[index]["hour"],self.ordred_population[index]["day"])
            self.ordred_population[index]["endH"] = self.ordred_population[index]["startH"] +self.ordred_population[index]["hour"]
            
            #change module
    def random_day(self):
        return  random.randint(1,5)  

    def random_prof(self,type,id):
        profs = []
        if type == 0 :
            session = None
            for cour in self.cours.cours :
                if cour["id"] == id:
                    session = cour
                    break
            for prof in session["repsonsables"] :
                profs.append(prof)
            if len(profs) > 0  :
                return profs[random.randint(0,len(profs) -1)]  
            else :
                return None
        else : 
            session = None
            for tdp in self.tdps.tdps :
                if tdp["id"] == id:
                    session = tdp
                    break
            for prof in session["repsonsablestdps"] :
                profs.append(prof)
            if len(profs) > 0  :
                return profs[random.randint(0,len(profs) -1)]  
            else :
                return None
    def random_requirement(self,id):
        reqs = []
        for requirement in self.requirements.requirements :
            if requirement["requirementId"] == id :
                reqs.append(requirement)
        
        if len(reqs) > 0  :
            return reqs[random.randint(0,len(reqs) -1)]  
        else :
            return None 
    def random_time(self,hour,day):
        number = random.randint(8,16)
        if hour <= 1 :
            if day == 3 :
                print("day ",day)
                number = 12
            else :
                number = random.randint(14,16)
        else :
            while (number == 12 and hour > 1 )  or number == 13 or (hour > 1  and number == 16  )  :
                    number = random.randint(8,16)

        return number       
    def check_if_exist_in_population(self,element):
        if element in self.population : 
            return  True
        return  False  
    def sum_time(self,day):
        sumH = 0 
        sumMin = 0 
        for element in self.temp_planning :
            if  element["day"] == day:
                sumH = sumH + element["hour"]
                sumMin = sumMin + element["min"]
        return sumH + (sumMin / 60)