export interface SubjectTemplate {
  name: string;
}

export interface SemesterSubjects {
  [semester: number]: SubjectTemplate[];
}

export interface DepartmentSubjects {
  [department: string]: SemesterSubjects;
}

export const subjectData: DepartmentSubjects = {
  CSE: {
    1: [
      { name: "BEEE (Basic Electrical and Electronics Engineering)" },
      { name: "BEEE Lab" },
      { name: "Heritage of Tamils" },
      { name: "EPL (Civil and Mechanical Lab)" },
      { name: "PUC (Programming using C)" },
      { name: "PUC Lab" },
      { name: "TC-I (Technical Communication-I)" },
      { name: "Linear Algebra and Calculus" },
      { name: "ICFM (Indian Constitution and Freedom Movement)" },
      { name: "Physics for Information Science" },
      { name: "Physics Lab" },
    ],
    2: [
      { name: "Python Lab" },
      { name: "Data Structures" },
      { name: "Data Structures Lab" },
      { name: "DLM (Digital Logic and Microprocessor)" },
      { name: "DLM Lab" },
      { name: "EG (Engineering Graphics)" },
      { name: "EPL (Electrical and Electronics)" },
      { name: "Tamils and Technology" },
      { name: "TC-II/EPC (English) )" },
      { name: "Discrete Mathematical Structures (Maths)" },
      { name: "EVS (Environmental Science And Engineering)" },
    ],
    3: [
      { name: "DBMS (Database Management System)" },
      { name: "DBMS Lab (Database Management System Lab)" },
      { name: "CA (Computer Architecture)" },
      { name: "Fourier Series and Number Theory" },
      { name: "DAA (Design Analysis and Algorithm)" },
      { name: "DAA Lab (Design Analysis and Algorithm Lab)" },
      { name: "FDS (Fundamentals of Data Science)" },
      { name: "FDS Lab (Fundamentals of Data Science Lab)" },
      { name: "JAVA" },
      { name: "JAVA Lab" },
    ],
  },
  AIDS: {
    1: [
      { name: "BEEE (Basic Electrical and Electronics Engineering)" },
      { name: "BEEE Lab" },
      { name: "Heritage of Tamils" },
      { name: "EPL (Electrical and Electronics Lab)" },
      { name: "PUC (Programming using C)" },
      { name: "PUC Lab" },
      { name: "ICFM (Indian Constitution and Freedom Movement)" },
      { name: "Physics for Information Science" },
      { name: "Physics Lab" },
      { name: "Mathematical Foundations" },
      { name: "TC-I (Technical Communication-I)" },
    ],
  },
  ECE: {
    1: [
      { name: "ED" },
      { name: "ED Lab" },
      { name: "Heritage of Tamils" },
      { name: "EPL (Electrical and Electronics Lab)" },
      { name: "PUC (Programming using C)" },
      { name: "PUC Lab" },
      { name: "TC-I (Technical Communication-I)" },
      { name: "Linear Algebra and Calculus" },
      { name: "ICFM (Indian Constitution and Freedom Movement)" },
      { name: "Chemistry" },
      { name: "Chemistry Lab" },
    ],
    3: [
      { name: "Fourier Series and Number Theory" },
      { name: "Analog Circuits–I" },
      { name: "Electromagnetic Fields" },
      { name: "Digital Principles and System Design" },
      { name: "Principles of Microprocessor and Microcontrollers" },
      { name: "(Lab) Principles of Microprocessor and Microcontrollers" },
      { name: "Introduction to Python Programming" },
      { name: "(Lab) Introduction to Python Programming" },
      { name: "(Lab) Analog and Digital Circuits Laboratory" },
    ],
  },
  BME: {
    1: [
      
      { name: "Heritage of Tamils" },
      { name: "EPL (Civil and Mechanical Lab)" },
      { name: "Engineering Graphics" },
      { name: "EVS (Environmental Science)" },
      { name: "Chemistry" },
      { name: "Chemistry Lab" },
      { name: "Linear Algebra and Calculus" },
      { name: "TC-I (Technical Communication-I)" },
    ],
    2: [
      { name: "Differential Equations and Complex Variables" },
      { name: "Engineering Mechanics for Biomedical Engineers" },
      { name: "Tamils Technology" },
      { name: "Data Structures using C" },
      { name: "Data Structure using C (Lab)" },
      { name: "Physics for Bioscience " },
      { name: "Physics for Bioscience (Lab)" },
      { name: "Electric Circuits and Machines " },
      { name: "Electric Circuits and Machines (Lab)" },
      
    ],
  },
  IT: {
    1: [
      { name: "BEEE (Basic Electrical and Electronics Engineering)" },
      { name: "BEEE Lab" },
      { name: "Heritage of Tamils" },
      { name: "EPL (Electrical and Electronics Lab)" },
      { name: "PUC (Programming using C)" },
      { name: "PUC Lab" },
      { name: "EVS (Environmental Science)" },
      { name: "Engineering Graphics" },
      { name: "Linear Algebra and Calculus" },
      { name: "TC-I (Technical Communication-I)" },
    ],
    2: [
       { name: "Python Lab" },
      { name: "Data Structures" },
      { name: "Data Structures Lab" },
      { name: "Microprocessors and Microcontrolers" },
      { name: "Microprocessors and Microcontrolers Lab" },
      { name: "DLM Lab" },
      { name: "Physics for Information Science" },
      { name: "Physics lab" },
      { name: "EPL (Civil and Mechanical)" },
      { name: "Tamils and Technology" },
      { name: "TC-II/EPC (English)" },
     
      { name: "Discrete Mathematical Structures (Maths)" },
      { name: "ICFM(Indian Constitution and Freedom Movement)" },
      
    ],
    3: [
      { name: "DBMS (Database Management System)" },
      { name: "DBMS Lab (Database Management System Lab)" },
      { name: "Analog and Digital Communication" },
      { name: "Fourier Series and Number Theory" },
      { name: "DAA (Design Analysis and Algorithm)" },
      { name: "DAA Lab (Design Analysis and Algorithm Lab)" },
      { name: "Digital Logic and CA" },
      { name: "Digital Logic and CA lab" },
      { name: "JAVA" },
      { name: "JAVA Lab" },
    ],
    
  }
};

export const departments = ["CSE", "AIDS", "ECE","IT", "BME","Others"] as const;
export const semesters = [1, 2, 3, 4, 5, 6, 7, 8] as const;
