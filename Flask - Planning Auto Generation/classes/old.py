 # Ordring Courses/TDs/TPs by "Coefficent"
        #print(" STEP 1 - Ordring TDs/TPs Dict List ASC ...")
        #self.tdps.tdps = sorted(self.tdps.tdps, key=lambda x: x['module']["coefficient"],reverse=False ) 
        #print(" STEP 2 - Ordring Cours Dict List DESC ...")
        #self.tdps.tdps = sorted(self.tdps.tdps, key=lambda x: x['module']["coefficient"],reverse=True )


 while max_iteration > 0 and not result :
    
                    print("Iteration number : ", 101 - max_iteration)
                    evaluation = self.evalute_planning()
                    days = []
                    correct_days = []
                    for i in range(1,6) :
                        if not evaluation[i]["hard_constraints"] :
                            days.append(i)
                        else :
                            correct_days.append(i)
                    result = evaluation[1]["hard_constraints"] and evaluation[2]["hard_constraints"] and evaluation[3]["hard_constraints"] and evaluation[4]["hard_constraints"] and evaluation[5]["hard_constraints"]
                    if not result :
                        mutation_counter += 1
                        if len(days)> 1 :
                            index1 = random.randint(0,len(days)-1)
                            index2 = random.randint(0,len(days)-1)
                            while index1 == index2 :
                                index1 = random.randint(0,len(days)-1)
                                index2 = random.randint(0,len(days)-1)
                            self.crossover(index1,index2)
                        else :
                            m_index = random.randint(0,len(correct_days)-1)
                            self.mutation(m_index)
                        if mutation_counter > 100 :
                            if len(correct_days) > 1 :
                                m_index = random.randint(0,len(correct_days)-1)
                                self.mutation(m_index)

                    max_iteration -= 1
                