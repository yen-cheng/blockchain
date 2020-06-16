$(function () {
  var lastBlock = 1;
  var blockNum = 1;

  class block {
    constructor(data, nonce, previousHash, hash) {
      this.id = blockNum++;
      this.data = data;
      this.nonce = nonce;
      this.previousHash = previousHash;
      this.hash = hash;
      this.hashLegal = true;
      this.preHashLegal = true;
    }

    checkLegal() {
      if (!hash.startsWith("000")) {
        this.hashLegal = false;
      }
      if (!hash.startsWith("000")) {
        this.previousHash = false;
      }
    }
  }

  $("#addBlock").click(function () {
    lastBlock++;
    $("#1").after(`
        <div class="row justify-content-center" id="${lastBlock}">
        <div class="card card-nav-tabs col-8">
        <div class="card-header card-header-success">
            <strong>#${lastBlock}</strong> <span>${new Date()}</span>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">
            <span class="badge badge-pill badge-default label">NONCE</span
            >Cras justo odio
            </li>
            <li class="list-group-item">
            <span class="badge badge-pill badge-default label">DATA</span
            ><input
                type="text"
                class="form-control"
                aria-describedby="data"
                placeholder="Input data"
            />
            </li>
            <li class="list-group-item">
            <span class="badge badge-pill badge-default label"
                >Previous Hash</span
            >Vestibulum at eros
            </li>
            <li class="list-group-item">
            <span class="badge badge-pill badge-default label">Hash</span
            >Vestibulum at eros
            </li>
        </ul>
        </div>
    </div>
    `);
  });
});
