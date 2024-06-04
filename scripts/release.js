import { Octokit } from "@octokit/core";
import 'dotenv/config' 

const { TOKEN, RELEASE_MAJOR, RELEASE_MINOR, RELEASE_PATCH } = process.env;
import { REPO, OWNER } from './consts.js';
const octokit = new Octokit({ auth: TOKEN });

const now = new Date();

const getLatestRelease = async () => {
  const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: OWNER,
    repo: REPO,
  });
  if (releases?.data.length > 0) {
    return releases?.data?.[0]?.tag_name;
  }
  return 'v0.0.0';
};

const newTagName = async () => {
  let oldTag = await getLatestRelease();
  oldTag = oldTag.replace('v', '').split('.');

  if (RELEASE_MAJOR === 'true') {
    const majorTagNum = parseInt(oldTag[0]) + 1;
    return `v${majorTagNum}.0.0`;
  }
  if (RELEASE_MINOR === 'true') {
    const minorTagNum = parseInt(oldTag[1]) + 1;
    return `v${oldTag[0]}.${minorTagNum}.0`;
  }
  if (RELEASE_PATCH === 'true') {
    const fixTagNum = parseInt(oldTag[2]) + 1;
    return `v${oldTag[0]}.${oldTag[1]}.${fixTagNum}`;
  }
  const fixTagNum = parseInt(oldTag[2]) + 1;
  return `v${oldTag[0]}.${oldTag[1]}.${fixTagNum}`;
};

const createRelease = async () => {
  const tag = await newTagName();
  const res = await octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner: OWNER,
    repo: REPO,
    tag_name: tag,
    name: tag,
  });
  return [res?.data?.upload_url, tag];
};

const script = async () => {
  const release = await createRelease();
};

script();