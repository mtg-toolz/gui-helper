#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use std::process::{Command};
use std::io::{self, Write};

#[tauri::command]
fn exec_proximity(folder_loc: String, deck_file: String, is_zip: String, use_official_art: String, reminder_text: String, debug_op: String, threads_op: String, border_op: String, artist_outline: String, copyright_op: String ) { 
  let str_options = format!("--reminder_text={} --debug={} --copyright_op={} --threads={}", reminder_text, debug_op, copyright_op, threads_op); 
  let mut template_file = "templates\\normal"; 
  if is_zip == "true" { 
    template_file = "templates.zip"
  }
  let path_deck = format!("{}\\{}", folder_loc, deck_file);
  let temp_deck = format!("--template={}\\{}", folder_loc, template_file);


  let cmd = format!("java -jar {}\\proximity-0.2.1.jar --cards={} {}", folder_loc, path_deck, temp_deck);
  let output = Command::new("java")
  .arg(cmd)
  .output()
  .expect("failed to run proximity");
  // .status()
  // .is_ok(); 
  println!("{}", output.status);
  println!("This ran");
  io::stdout().write_all(&output.stdout).unwrap();
  io::stderr().write_all(&output.stderr).unwrap();
}


#[tauri::command]
fn check_for_java() -> bool { 
  let output = Command::new("java")
            .arg("--version")
            .status()
            .is_ok();
    // println!("{}", output);
    output.into()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![check_for_java, exec_proximity])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
