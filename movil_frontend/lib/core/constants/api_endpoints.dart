class ApiEndpoints {
 // Auth
 static const String login = "/auth/token/";
 static const String refresh = "/auth/token/refresh/";

 // Estudiantes
// ESTUDIANTES
static const String students = "/students/";
static String studentGrades(int id) => "/students/$id/grades/";
static String studentAttendance(int id) => "/students/$id/attendance/";
static String studentTasks(int id) => "/students/$id/tasks/";


 // Padres
 static String parentChildren(int id) => "/parents/$id/children/";
 static String parentGrades(int id) => "/parents/$id/grades/";
 static String parentAttendance(int id) => "/parents/$id/attendance/";

 // Anuncios
 static const String announcements = "/announcements/";
 static const String lastAnnouncement = "/announcements/last/";
}
