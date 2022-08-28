import { readFileSync } from 'fs'; 
import { DehydratedState } from 'react-query';

const stats = JSON.parse(readFileSync('./stats.json', 'utf-8'));

export const renderHtml = (app: string, dehydratedState: DehydratedState): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <link rel="stylesheet" href="/assets/style.css" />
      
      <title>FairMatch.io</title>
    </head>
    <body>
      <div id="app">${app}</div>
      <script>
        window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};
      </script>
      <script src="/${stats.bundle}"></script>
    </body>
    </html>
  `;
};