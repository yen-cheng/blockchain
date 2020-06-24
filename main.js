$(function () {
  const INITIAL_HASH =
    "0000000000000000000000000000000000000000000000000000000000000000";
  const VALIDATION = "000";

  var blockNum = 0;
  const blockChain = [];

  class Block {
    constructor(id, data, nonce, hash) {
      this.id = id;
      this.data = data;
      this.nonce = nonce;
      this.hash = hash;
    }
  }

  const generateValidateHash = (preHash, data) => {
    let nonce = 0;
    while (true) {
      let test = data + preHash + nonce;
      let hash = sha256(test);
      if (hash.startsWith(VALIDATION)) {
        return { nonce: nonce, hash: hash };
      }
      nonce++;
    }
  };

  const generateHash = (preHash, data, nonce) => {
    let test = data + preHash + nonce;
    let hash = sha256(test);
    return hash;
  };

  $("#addBlock").click(function () {
    blockNum++;
    let previousId = "#block_" + (blockNum - 1);
    let data = $("#newBlock").val();

    let preHash = getPreviousHash(blockNum);

    let { nonce, hash } = generateValidateHash(preHash, data);

    const block = new Block(blockNum, data, nonce, hash);
    blockChain.push(block);

    addBlockHtml(previousId, block, preHash);

    let dataId = "#data_" + block.id;
    let hashId = ".hash_" + block.id;
    let preHashId = ".hash_" + (block.id - 1);
    $(dataId).val(block.data);
    $(hashId).css("color", "green");
    if (preHash.startsWith(VALIDATION)) {
      $(preHashId).css("color", "green");
    } else {
      $(preHashId).css("color", "red");
    }
    $("#newBlock").val("");

    $("input").on("input", function (event) {
      let id = event.target.id;
      let block_id = parseInt(id.split("_")[1]);
      blockChain[block_id - 1].data = $(this).val();
      for (let i = block_id - 1; i < blockChain.length; i++) {
        let preHash;
        if (i == 0) {
          preHash = INITIAL_HASH;
        } else {
          preHash = blockChain[i - 1].hash;
        }
        let newHash = generateHash(
          preHash,
          blockChain[i].data,
          blockChain[i].nonce
        );
        blockChain[i].hash = newHash;
        $(".hash_" + (i + 1)).text(newHash);
        if (!newHash.startsWith(VALIDATION)) {
          $(".hash_" + (i + 1)).css("color", "red");
          $(".hash_" + (i + 1)).css("border-style", "groove");
          $(".hash_" + (i + 1)).css("border-color", "red");
          $(".hash_" + (i + 1)).css("border-radius", "5px");
          $(".hash_" + (i + 1)).css("border-width", "1px");
        }
      }
    });

    $("#mindBtn_" + block.id).on("click", function (event) {
      let id = event.target.id;
      let block_id = parseInt(id.split("_")[1]);
      for (let i = block_id - 1; i < blockChain.length; i++) {
        let preHash;
        if (block_id - 1 == 0) {
          preHash = INITIAL_HASH;
        } else {
          preHash = blockChain[block_id - 1 - 1].hash;
        }
        let { nonce, hash } = generateValidateHash(
          preHash,
          blockChain[block_id - 1].data
        );
        blockChain[block_id - 1].hash = hash;
        blockChain[block_id - 1].nonce = nonce;
        $(".hash_" + block_id).text(hash);
        $("#nonce_" + block_id).text(nonce);
        if (hash.startsWith(VALIDATION)) {
          $(".hash_" + block_id).css("color", "green");
          $(".hash_" + block_id).css("border-style", "");
          $(".hash_" + block_id).css("border-color", "");
          $(".hash_" + block_id).css("border-radius", "");
          $(".hash_" + block_id).css("border-width", "");
        }
      }
    });
  });

  const getPreviousHash = (blockNum) => {
    if (blockNum === 1) {
      return INITIAL_HASH;
    } else {
      return blockChain[blockNum - 2].hash;
    }
  };

  const addBlockHtml = (previousId, block, preHash) => {
    $(previousId).after(`
          <div class="row justify-content-center" id="block_${block.id}">
          <div class="card card-nav-tabs col-9">
          <div class="card-header card-header-success" id="block-header_${
            block.id
          }">
              <strong>#${block.id}</strong> <span>${new Date()}</span>
          </div>
          <ul class="list-group list-group-flush">
              <li class="list-group-item">
              <span class="badge badge-pill badge-default label">NONCE</span
              ><span id="nonce_${block.id}">${block.nonce}</span>
              </li>
              <li class="list-group-item">
              <span class="badge badge-pill badge-default label">DATA</span
              ><input
                  type="text"
                  id="data_${block.id}"
                  class="form-control block-data"
                  aria-describedby="data"
                  placeholder="Input data"
              />
              </li>
              <li class="list-group-item">
              <span class="badge badge-pill badge-default label"
                  >Previous Hash</span
              ><span class="badge badge-pill hash_${
                block.id - 1
              }">${preHash}</span>
              </li>
              <li class="list-group-item">
              <span class="badge badge-pill badge-default label">Hash</span
              ><span class="badge badge-pill hash_${block.id}">${
      block.hash
    }</span>
              </li>
              <li class="list-group-item"><button class="btn btn-success btn-round mindBtn" id="mindBtn_${
                block.id
              }">MINE</button></li>
          </ul>
          </div>
      </div>
      `);
  };
});
