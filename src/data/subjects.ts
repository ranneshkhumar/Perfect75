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
      { name: "TC-II (Technical Communication-II)" },
      { name: "EPC (English for Professional Competence)" },
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
};

export const departments = ["CSE", "AIDS", "ECE", "Others"] as const;
export const semesters = [1, 2, 3, 4, 5, 6, 7, 8] as const;
