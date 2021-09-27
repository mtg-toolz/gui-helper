#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use std::process::{Command};
use std::io::{self, Write};

#[tauri::command]
fn exec_proximity(folder_loc: String, deck_file: String,  use_official_art: String, reminder_text: String, debug_op: String, threads_op: String, border_op: String, artist_outline: String, copyright_op: String ) { 
  // let str_options = format!("--use_official_art={} --copyright={} --reminder_text={} --debug={} --copyright_op={} --threads={}", use_official_art, copyright_op, reminder_text, debug_op, copyright_op, threads_op); 
  let cmd = format!("--cards={}", deck_file);
  let art = format!("--use_official_art={}", use_official_art);
  let copy = format!("--copyright={}", copyright_op);
  let output = Command::new("java")
  .args(&["-jar", "proximity-0.2.1.jar", "--template=normal", &cmd, &art, &copy])
  .output()
  .expect("failed to run proximity");
  // .status()
  // .is_ok(); 
  println!("{}", output.status);
  io::stdout().write_all(&output.stdout).unwrap();
  io::stderr().write_all(&output.stderr).unwrap();
}


#[tauri::command]
fn check_for_java() -> bool { 
  let output = Command::new("java")
            .arg("--version")
            .status()
            .is_ok();
    output.into()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![check_for_java, exec_proximity])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
