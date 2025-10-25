
const weights = {
  normal: '\x1b[22m',
  bold: '\x1b[1m'
};
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

class Debugger {
  info(message: string): void {
    console.log(
      `${colors.fg.blue}${weights.bold}[INFO] ${colors.reset}${message}`
    );
  }

  warn(message: string): void {
    console.log(
      `${colors.fg.yellow}${weights.bold}[WARN] ${colors.reset}${message}`
    );
  }

  error(message: string): void {
    console.log(
      `${colors.fg.red}${weights.bold}[ERROR] ${colors.reset}${message}`
    );
  }

  success(message: string): void {
    console.log(
      `${colors.fg.green}${weights.bold}[SUCCESS] ${colors.reset}${message}`
    );
  }

  debug(message: string): void {
    console.log(
      `${colors.fg.cyan}${weights.bold}[DEBUG] ${colors.reset}${message}`
    );
  }

  custom(message: string, color: keyof typeof colors.fg): void {
    console.log(
      `${colors.fg[color] || colors.fg.white}[CUSTOM] ${colors.reset}${message}`
    );
  }
}

export const logger = new Debugger();