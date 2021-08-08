FROM node:14-alpine

WORKDIR /src/app
COPY package* ./

RUN npm ci
COPY . .
EXPOSE 3000

ENV JWT_SECRET=qwaeszrdxtfc
ENV JWT_EXPIRES_IN=3d
ENV MONGODB_LOCAL_URI=mongodb+srv://gabriel:qbjstuhcR13vcUMS@cluster0.dnhyj.mongodb.net/afrivac?retryWrites=true&w=majority
ENV GOOGLE_CLIENT_ID=546458752785-s6vo1c96k1m4t3foh5uhq7c0lttj9cib.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=4zjhL2zWhSYyekrSSOvtTh36
ENV GOOGLE_CALLBACK_URL=http://127.0.0.1:3000/api/v1/auth/google/callback

CMD ["npm", "start"]
