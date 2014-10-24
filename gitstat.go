package main

import (
  "bufio"
  "encoding/json"
  "fmt"
  "io"
  "log"
  "os/exec"
  "strconv"
  "strings"
  "time"
)

type commit struct {
  SHA string
  Date time.Time
  Author string
  Message string
}

func parseLogLine(line string) commit {
  logParts := strings.Split(line, "~")
  timestamp, _ := strconv.ParseInt(logParts[1], 10, 64)
  return commit{logParts[0], time.Unix(timestamp, 0), logParts[2], logParts[3]}
}

func main () {

    command := exec.Command("git", "--no-pager", "log", "--pretty=format:%H~%at~%an~%s")
    stdout, _ := command.StdoutPipe()
    reader := bufio.NewReader(stdout)

    if err := command.Start(); err != nil {
      log.Fatal("Buffer Error:", err)
    }

    first := true // hurk

    fmt.Println("[")

    for {
      str, err := reader.ReadString('\n')

      if err != io.EOF && err != nil {
        log.Fatal("Read Error:", err)
        return
      }

      if str != "" {
        str = strings.TrimSuffix(str, "\n")
        commit := parseLogLine(str)

        if !first {
          fmt.Printf(",\n")
        }

        first = false
        json, _ := json.Marshal(commit)
        fmt.Printf("  %s", json)
      } else {
        break
      }
    }

    fmt.Println()
    fmt.Println("]")
}
