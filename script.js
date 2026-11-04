// 1) كلاس الطالب: يستقبل رقم الجلوس والاسم والدرجات والحضور.
class Student {
  constructor(id, name, grades, attendance) {
    this.id = id;
    this.name = name;
    this.grades = grades;
    this.attendance = attendance;
  }

  // 2) حساب المتوسط باستخدام reduce.
  calculateAverage() {
    const total = this.grades.reduce((sum, grade) => sum + grade, 0);
    return total / this.grades.length;
  }

  // 3) تحويل المتوسط إلى تقدير بالحروف.
  getGrade(average) {
    if (average >= 90) return "A";
    else if (average >= 80) return "B";
    else if (average >= 70) return "C";
    else if (average >= 60) return "D";
    else if (average >= 50) return "E";
    else return "F";
  }

  // 4) النجاح يتطلب متوسط 50 على الأقل وحضور 75% على الأقل.
  getFinalResult(average) {
    if (average >= 50 && this.attendance >= 75) {
      return "ناجح";
    } else {
      return "يحتاج مراجعة";
    }
  }
}

// 5) المصفوفة الرئيسية: أربعة كائنات من Student.
// يوجد طالبان متوسطهما بين 40 و49 لتجربة لجنة الرأفة.
const studentsList = [
  new Student(1001, "أحمد عصام ", [85, 90, 80], 95),
  new Student(1002, "سارة علي", [45, 48, 42], 88),
  new Student(1003, "محمود حسن", [70, 75, 68], 80),
  new Student(1004, "منى إبراهيم", [40, 46, 43], 70)
];

// 6) استخراج الطلاب الذين متوسطهم من 40 إلى 49 باستخدام filter.
const strugglingStudents = studentsList.filter((student) => {
  const average = student.calculateAverage();
  return average >= 40 && average <= 49;
});

// 7) إضافة خمس درجات إلى متوسط كل طالب متعثر باستخدام map.
const mercyResults = strugglingStudents.map((student) => {
  const oldAverage = student.calculateAverage();
  const newAverage = oldAverage + 5;

  return {
    id: student.id,
    name: student.name,
    oldAverage: oldAverage,
    newAverage: newAverage
  };
});

// 8) جمع المتوسطات الجديدة باستخدام reduce.
const totalAfterMercy = mercyResults.reduce((sum, student) => {
  return sum + student.newAverage;
}, 0);

// درع حماية من القسمة على صفر.
const mercyAverage = mercyResults.length > 0
  ? totalAfterMercy / mercyResults.length
  : 0;

// 9) طباعة تقرير كل طالب في Console.
console.log("===== تقرير جميع الطلاب =====");
studentsList.forEach((student) => {
  const average = student.calculateAverage();
  console.log({
    الاسم: student.name,
    المتوسط: average.toFixed(2),
    التقدير: student.getGrade(average),
    النتيجة: student.getFinalResult(average)
  });
});

// 10) طباعة تقرير لجنة الرأفة.
console.log("===== الطلاب المستفيدون من لجنة الرأفة =====");
console.table(mercyResults);
console.log("متوسط درجات المتعثرين بعد الرأفة:", mercyAverage.toFixed(2));

// 11) عرض البيانات على صفحة Dashboard.
const studentsTable = document.getElementById("studentsTable");
const mercyTable = document.getElementById("mercyTable");

studentsList.forEach((student) => {
  const average = student.calculateAverage();
  const result = student.getFinalResult(average);
  const statusClass = result === "ناجح" ? "status-pass" : "status-review";

  studentsTable.innerHTML += `
    <tr>
      <td>${student.id}</td>
      <td class="fw-bold">${student.name}</td>
      <td class="grade-list">${student.grades.join(" - ")}</td>
      <td>${student.attendance}%</td>
      <td class="fw-bold">${average.toFixed(2)}</td>
      <td><span class="badge text-bg-light">${student.getGrade(average)}</span></td>
      <td><span class="status-badge ${statusClass}">${result}</span></td>
    </tr>
  `;
});

if (mercyResults.length > 0) {
  mercyResults.forEach((student) => {
    mercyTable.innerHTML += `
      <tr>
        <td>${student.id}</td>
        <td class="fw-bold">${student.name}</td>
        <td>${student.oldAverage.toFixed(2)}</td>
        <td class="text-primary fw-bold">${student.newAverage.toFixed(2)}</td>
      </tr>
    `;
  });
} else {
  mercyTable.innerHTML = `<tr><td colspan="4" class="empty-row">لا يوجد طلاب مستحقون للرأفة.</td></tr>`;
}

document.getElementById("totalStudents").textContent = studentsList.length;
document.getElementById("passedStudents").textContent = studentsList.filter((student) => {
  return student.getFinalResult(student.calculateAverage()) === "ناجح";
}).length;
document.getElementById("reviewStudents").textContent = studentsList.filter((student) => {
  return student.getFinalResult(student.calculateAverage()) === "يحتاج مراجعة";
}).length;
document.getElementById("mercyStudents").textContent = mercyResults.length;
document.getElementById("mercyAverage").textContent = mercyResults.length > 0
  ? mercyAverage.toFixed(2)
  : "لا يوجد طلاب";
