import { createTheme } from "@material-ui/core";

const theme = createTheme({
    palette: {
      type: 'dark',
      background: {
        default: "#000000"
      },
      primary: {
        main: "#848484",
      },
      secondary: {
        main: "#b552f7",
      },
    },
    typography: {
        button: {
            textTransform: 'none'
        }
    }
});

export default theme