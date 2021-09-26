#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use std::process::{Command};

#[tauri::command]
fn exec_proximity(folderLoc: String, isTxt: String, isZip: String, isTemp: String, useOfficialArt: String, reminderText: String, debugOp: String, threadsOp: String, borderOp: String, artistOutline: String, copyRight: String ) { 
  let str = format!("--reminder_text={} --debug={} --copyright={}", reminderText, debugOp, copyRight); 
  // let output = Command::new("java")
  // .arg("-jar proximity.jar --cards=something.txt --template=normal.zip")
  // .status()
  // .is_ok(); 
}


#[tauri::command]
fn check_for_java() -> bool { 
  let output = Command::new("java")
            .arg("--version")
            .status()
            .is_ok();
    println!("{}", output);
    output.into()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![check_for_java, exec_proximity])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
