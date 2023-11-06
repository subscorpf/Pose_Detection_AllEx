

export function find_angle(A,B,C) {
    var AB = Math.sqrt(Math.pow(B[0]-A[0],2)+ Math.pow(B[1]-A[1],2));    
    var BC = Math.sqrt(Math.pow(B[0]-C[0],2)+ Math.pow(B[1]-C[1],2)); 
    var AC = Math.sqrt(Math.pow(C[0]-A[0],2)+ Math.pow(C[1]-A[1],2));
    const angle = (Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*180)/Math.PI;
    return angle;
  }

  